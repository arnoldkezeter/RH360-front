// ── Icônes SVG inline ─────────────────────────────────────────────────────────

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../_redux/store";
import { useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { importErreur, importReinitialiser, importDebut, importSucces } from "../../_redux/features/import";
import { importerPersonnelExcel } from "../../services/importAPI";

const IconUpload = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={32} height={32}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

const IconFile = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={20} height={20}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const IconWarning = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={18} height={18}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={16} height={16}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconSpinner = () => (
  <svg viewBox="0 0 24 24" fill="none" width={20} height={20} style={{ animation: "spin 1s linear infinite" }}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="10" strokeLinecap="round" />
  </svg>
);

const IconRefresh = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width={16} height={16}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

// ── Composant StatCard ────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: number;
  color: "emerald" | "sky" | "amber" | "rose" | "slate";
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color }) => {
  const colorMap = {
    emerald: { bg: "#ecfdf5", border: "#6ee7b7", text: "#065f46", num: "#10b981" },
    sky:     { bg: "#f0f9ff", border: "#7dd3fc", text: "#0c4a6e", num: "#0ea5e9" },
    amber:   { bg: "#fffbeb", border: "#fcd34d", text: "#78350f", num: "#f59e0b" },
    rose:    { bg: "#fff1f2", border: "#fda4af", text: "#881337", num: "#f43f5e" },
    slate:   { bg: "#f8fafc", border: "#cbd5e1", text: "#334155", num: "#64748b" },
  };
  const c = colorMap[color];

  return (
    <div style={{
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: 10,
      padding: "14px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 4,
      minWidth: 0,
    }}>
      <span style={{ fontSize: 22, fontWeight: 700, color: c.num, fontFamily: "'DM Mono', monospace" }}>
        {value.toLocaleString()}
      </span>
      <span style={{ fontSize: 11, fontWeight: 600, color: c.text, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </span>
    </div>
  );
};

// ── Composant principal ───────────────────────────────────────────────────────

const ImportPersonnel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const { statut, message, erreur, stats, utilisateursNonTraites } = useSelector(
    (state: RootState) => state.importPersonnelSlice
  );

  const [fichier, setFichier] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [voirErreurs, setVoirErreurs] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Drag & Drop ─────────────────────────────────────────────────────────────

  const validerFichier = (f: File): string | null => {
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (!["xlsx", "xls"].includes(ext || "")) return t('import_personnel.format_non_supporte');
    if (f.size > 10 * 1024 * 1024) return t('import_personnel.fichier_trop_volumineux');
    return null;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files[0];
    if (!f) return;
    const err = validerFichier(f);
    if (err) { dispatch(importErreur(err)); return; }
    dispatch(importReinitialiser());
    setFichier(f);
  }, [dispatch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validerFichier(f);
    if (err) { dispatch(importErreur(err)); return; }
    dispatch(importReinitialiser());
    setFichier(f);
  };

  // ── Lancement de l'import ───────────────────────────────────────────────────

  const lancerImport = async () => {
    if (!fichier) return;
    dispatch(importDebut());
    try {
      const resultat = await importerPersonnelExcel(fichier, lang);
      dispatch(importSucces(resultat));
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        t('import_personnel.erreur_generique');
      dispatch(importErreur(msg));
    }
  };

  const reinitialiser = () => {
    dispatch(importReinitialiser());
    setFichier(null);
    setVoirErreurs(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  // ── Formatage taille fichier ────────────────────────────────────────────────

  const formatTaille = (bytes: number) => {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  };

  const enCours = statut === "en_cours";

  // ── Rendu ───────────────────────────────────────────────────────────────────

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f1f5f9",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "40px 16px",
      fontFamily: "'Outfit', 'Segoe UI', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
        .import-card { animation: fadeSlideIn 0.35s ease both; }
        .drop-zone:hover { border-color: #3b82f6 !important; background: #eff6ff !important; }
        .drop-zone-active { border-color: #3b82f6 !important; background: #dbeafe !important; }
        .btn-primary { transition: all 0.18s; }
        .btn-primary:hover:not(:disabled) { background: #1d4ed8 !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37,99,235,0.35) !important; }
        .btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }
        .btn-ghost:hover { background: #f1f5f9 !important; }
        .erreur-row:hover { background: #fff7f7 !important; }
        .tab-btn { transition: all 0.15s; }
        .tab-btn:hover { color: #1e40af !important; }
        input[type=file] { display: none; }
      `}</style>

      <div className="import-card" style={{ width: "100%", maxWidth: 760 }}>

        {/* ── En-tête ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: "linear-gradient(135deg, #2563eb, #0ea5e9)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <IconUpload />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
                {t('import_personnel.titre')}
              </h1>
              <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
                {t('import_personnel.sous_titre')}
              </p>
            </div>
          </div>
        </div>

        {/* ── Zone principale ── */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}>

          {/* Zone de dépôt */}
          <div style={{ padding: "28px 28px 24px" }}>
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              disabled={enCours}
            />

            {!fichier ? (
              <div
                className={`drop-zone ${drag ? "drop-zone-active" : ""}`}
                onClick={() => !enCours && inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={handleDrop}
                style={{
                  border: "2px dashed #cbd5e1",
                  borderRadius: 12,
                  padding: "48px 24px",
                  textAlign: "center",
                  cursor: enCours ? "not-allowed" : "pointer",
                  background: "#fafbfc",
                  transition: "all 0.2s",
                }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "#eff6ff", display: "inline-flex",
                  alignItems: "center", justifyContent: "center",
                  marginBottom: 14, color: "#3b82f6",
                }}>
                  <IconUpload />
                </div>
                <p style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 600, color: "#1e293b" }}>
                  {t('import_personnel.glisser_deposer')}
                </p>
                <p style={{ margin: "0 0 16px", fontSize: 13, color: "#94a3b8" }}>
                  {t('import_personnel.ou_cliquer')}
                </p>
                <span style={{
                  display: "inline-block", fontSize: 11, fontWeight: 600,
                  color: "#64748b", background: "#f1f5f9",
                  border: "1px solid #e2e8f0", borderRadius: 6,
                  padding: "4px 10px", letterSpacing: "0.05em",
                }}>
                  {t('import_personnel.format_max')}
                </span>
              </div>
            ) : (
              /* Fichier sélectionné */
              <div style={{
                border: "1.5px solid #bfdbfe",
                borderRadius: 12, padding: "16px 18px",
                background: "#f0f9ff",
                display: "flex", alignItems: "center", gap: 14,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: "#dbeafe", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  color: "#2563eb", flexShrink: 0,
                }}>
                  <IconFile />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    margin: "0 0 2px", fontSize: 14, fontWeight: 600,
                    color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {fichier.name}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                    {formatTaille(fichier.size)}
                  </p>
                </div>
                {!enCours && statut !== "succes" && (
                  <button
                    onClick={reinitialiser}
                    className="btn-ghost"
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "#94a3b8", padding: 6, borderRadius: 6,
                      display: "flex", alignItems: "center",
                    }}
                  >
                    <IconClose />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Bouton d'action */}
          <div style={{ padding: "0 28px 24px", display: "flex", gap: 10 }}>
            <button
              className="btn-primary"
              onClick={lancerImport}
              disabled={!fichier || enCours || statut === "succes"}
              style={{
                flex: 1,
                padding: "12px 20px",
                background: "linear-gradient(135deg, #2563eb, #0ea5e9)",
                color: "#fff", border: "none", borderRadius: 10,
                fontSize: 14, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 2px 6px rgba(37,99,235,0.25)",
              }}
            >
              {enCours ? (
                <><IconSpinner /> {t('import_personnel.importation_en_cours')}</>
              ) : (
                <><IconUpload /> {t('import_personnel.lancer_importation')}</>
              )}
            </button>

            {(statut === "succes" || statut === "erreur") && (
              <button
                onClick={reinitialiser}
                className="btn-ghost"
                style={{
                  padding: "12px 16px",
                  background: "#f8fafc", color: "#475569",
                  border: "1.5px solid #e2e8f0", borderRadius: 10,
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                <IconRefresh /> {t('import_personnel.nouveau')}
              </button>
            )}
          </div>

          {/* ── Barre de progression (en cours) ── */}
          {enCours && (
            <div style={{ padding: "0 28px 24px" }}>
              <div style={{
                height: 6, background: "#e2e8f0", borderRadius: 99, overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", width: "60%",
                  background: "linear-gradient(90deg, #2563eb, #0ea5e9)",
                  borderRadius: 99,
                  animation: "pulse 1.4s ease-in-out infinite",
                }} />
              </div>
              <p style={{ margin: "8px 0 0", fontSize: 12, color: "#94a3b8", textAlign: "center" }}>
                {t('import_personnel.traitement_en_cours')}
              </p>
            </div>
          )}

          {/* ── Erreur globale ── */}
          {statut === "erreur" && erreur && (
            <div style={{
              margin: "0 28px 24px",
              background: "#fff1f2", border: "1px solid #fda4af",
              borderRadius: 10, padding: "14px 16px",
              display: "flex", gap: 10, alignItems: "flex-start",
              color: "#9f1239",
            }}>
              <IconWarning />
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>{erreur}</p>
            </div>
          )}

          {/* ── Résultat succès ── */}
          {statut === "succes" && stats && (
            <div style={{ padding: "0 28px 28px" }}>

              {/* Message succès */}
              <div style={{
                background: "#f0fdf4", border: "1px solid #86efac",
                borderRadius: 10, padding: "12px 16px",
                display: "flex", gap: 10, alignItems: "center",
                color: "#166534", marginBottom: 20,
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: "#22c55e", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  color: "#fff", flexShrink: 0,
                }}>
                  <IconCheck />
                </div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{message}</p>
              </div>

              {/* Stats utilisateurs */}
              <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {t('import_personnel.utilisateurs')}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
                <StatCard label={t('import_personnel.crees')}      value={stats.utilisateursCrees}    color="emerald" />
                <StatCard label={t('import_personnel.mis_a_jour')} value={stats.utilisateursMisAJour} color="sky" />
                <StatCard label={t('import_personnel.ignores')}    value={stats.utilisateursIgnores}  color="amber" />
              </div>

              {/* Stats entités */}
              <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {t('import_personnel.nouvelles_entites')}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 20 }}>
                {stats.nouvellesRegions > 0      && <StatCard label={t('import_personnel.regions')}      value={stats.nouvellesRegions}      color="slate" />}
                {stats.nouveauxDepartements > 0  && <StatCard label={t('import_personnel.departements')} value={stats.nouveauxDepartements}  color="slate" />}
                {stats.nouvellesCommunes > 0      && <StatCard label={t('import_personnel.communes')}     value={stats.nouvellesCommunes}      color="slate" />}
                {stats.nouveauxGrades > 0         && <StatCard label={t('import_personnel.grades')}       value={stats.nouveauxGrades}         color="slate" />}
                {stats.nouvellesCategories > 0    && <StatCard label={t('import_personnel.categories')}   value={stats.nouvellesCategories}    color="slate" />}
                {stats.nouvellesStructures > 0    && <StatCard label={t('import_personnel.structures')}   value={stats.nouvellesStructures}    color="slate" />}
                {stats.nouveauxServices > 0       && <StatCard label={t('import_personnel.services')}     value={stats.nouveauxServices}       color="slate" />}
                {stats.nouveauxPostes > 0         && <StatCard label={t('import_personnel.postes')}       value={stats.nouveauxPostes}         color="slate" />}
              </div>

              {/* Utilisateurs non traités */}
              {utilisateursNonTraites.length > 0 && (
                <div style={{
                  border: "1px solid #fde68a",
                  borderRadius: 10, overflow: "hidden",
                }}>
                  <button
                    className="tab-btn"
                    onClick={() => setVoirErreurs((v) => !v)}
                    style={{
                      width: "100%", padding: "12px 16px",
                      background: "#fffbeb", border: "none",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      cursor: "pointer", color: "#92400e",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600 }}>
                      <IconWarning />
                      {utilisateursNonTraites.length}{" "}
                      {utilisateursNonTraites.length > 1
                        ? t('import_personnel.lignes_non_traitees_other')
                        : t('import_personnel.lignes_non_traitees_one')
                      }
                    </span>
                    <span style={{ fontSize: 11, color: "#b45309", fontWeight: 500 }}>
                      {voirErreurs ? t('import_personnel.masquer') : t('import_personnel.voir_detail')}
                    </span>
                  </button>

                  {voirErreurs && (
                    <div style={{ maxHeight: 320, overflowY: "auto" }}>
                      {utilisateursNonTraites.map((u, i) => (
                        <ErreurLigne key={i} utilisateur={u} index={i} total={utilisateursNonTraites.length} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Note de bas de page */}
        <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", marginTop: 16 }}>
          {t('import_personnel.note_bas')}
        </p>
      </div>
    </div>
  );
};

// ── Sous-composant : ligne d'erreur ───────────────────────────────────────────

const ErreurLigne: React.FC<{
  utilisateur: UtilisateurNonTraite;
  index: number;
  total: number;
}> = ({ utilisateur, index, total }) => (
  <div
    className="erreur-row"
    style={{
      padding: "12px 16px",
      borderTop: index === 0 ? "none" : "1px solid #fef3c7",
      background: "#fff",
      transition: "background 0.15s",
    }}
  >
    <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
      <span style={{
        fontSize: 10, fontWeight: 700, color: "#b45309",
        background: "#fef3c7", borderRadius: 4,
        padding: "2px 6px", fontFamily: "'DM Mono', monospace",
        flexShrink: 0,
      }}>
        L.{utilisateur.numeroLigne}
      </span>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {utilisateur.nom || utilisateur.matricule || "—"}
      </span>
      {utilisateur.matricule && utilisateur.nom && (
        <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: "'DM Mono', monospace", flexShrink: 0 }}>
          {utilisateur.matricule}
        </span>
      )}
    </div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {utilisateur.raisons.map((r, j) => (
        <span key={j} style={{
          fontSize: 11, color: "#9f1239",
          background: "#fff1f2", border: "1px solid #fecdd3",
          borderRadius: 5, padding: "2px 8px",
        }}>
          {r}
        </span>
      ))}
    </div>
  </div>
);

export default ImportPersonnel;