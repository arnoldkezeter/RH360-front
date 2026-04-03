// pages/Elaboration/ThemeFormation/TDR/GenerateurTDR.tsx
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
    FiFileText, FiChevronDown, FiChevronUp, FiPlus, FiTrash2,
    FiDownload, FiLoader, FiAlertCircle, FiCheckCircle, FiInfo,
    FiCalendar, FiMapPin, FiUsers, FiDollarSign, FiTarget,
    FiBook, FiSettings, FiStar, FiEdit3,
} from "react-icons/fi";
import { RootState } from "../../../_redux/store";
import {
    setTDRLoading, setTDRGenerating, setTDRError,
    setTDRPrefill, updateTDRField, addModule, updateModule,
    removeModule, addObjectif, updateObjectif, removeObjectif,
    resetTDR,
    setHoraireGlobal,
    updatePlage,
    removePlage,
    updateModuleDansPlage,
    removeModuleDansPlage,
    addModuleToPlage,
    setPlausePause,
    addPlage,
} from "../../../_redux/features/elaborations/tdrSlice";
import { getTDRPrefill, genererTDR, downloadPDFBlob } from "../../../services/elaborations/tdrAPI";
import BreadcrumbPageDescription from "../../../components/BreadcrumbPageDescription";

// ── Couleurs constantes ───────────────────────────────────────────────────────
const COLORS = {
    primary: "#1e3a8a",
    primaryLight: "#2563eb",
    primaryFaded: "#dbeafe",
    accent: "#0ea5e9",
    success: "#059669",
    successLight: "#d1fae5",
    warning: "#d97706",
    warningLight: "#fef3c7",
    danger: "#dc2626",
    dangerLight: "#fee2e2",
    gray50: "#f9fafb",
    gray100: "#f3f4f6",
    gray200: "#e5e7eb",
    gray300: "#d1d5db",
    gray400: "#9ca3af",
    gray500: "#6b7280",
    gray600: "#4b5563",
    gray700: "#374151",
    gray800: "#1f2937",
    white: "#ffffff",
    prefill: "#fffbeb",      // fond jaune pâle = donnée venant de la BD
    prefillBorder: "#fbbf24",
};

// ── Composant Badge "pré-rempli depuis BD" ────────────────────────────────────
const PrefilledBadge = ({ t }: { t: (k: string) => string }) => (
    <span style={{
        fontSize: "10px",
        fontWeight: 600,
        color: COLORS.warning,
        background: COLORS.warningLight,
        border: `1px solid ${COLORS.prefillBorder}`,
        borderRadius: "4px",
        padding: "1px 6px",
        marginLeft: "6px",
        verticalAlign: "middle",
    }}>
        {t("tdr.depuis_bd")}
    </span>
);

// ── Section accordéon ─────────────────────────────────────────────────────────
interface SectionProps {
    id: string;
    title: string;
    icon: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    isComplete?: boolean;
    isRequired?: boolean;
}

const Section = ({ id, title, icon, isOpen, onToggle, children, isComplete, isRequired }: SectionProps) => (
    <div style={{
        border: `1px solid ${isOpen ? COLORS.primary : COLORS.gray200}`,
        borderRadius: "10px",
        marginBottom: "12px",
        overflow: "hidden",
        transition: "border-color 0.2s",
        boxShadow: isOpen ? `0 2px 12px rgba(30,58,138,0.08)` : "none",
    }}>
        <button
            type="button"
            onClick={onToggle}
            style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px",
                background: isOpen ? COLORS.primary : COLORS.white,
                color: isOpen ? COLORS.white : COLORS.gray700,
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                textAlign: "left",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "18px" }}>{icon}</span>
                <span style={{ fontWeight: 600, fontSize: "14px" }}>{title}</span>
                {isRequired && !isComplete && (
                    <span style={{
                        fontSize: "10px", background: COLORS.danger,
                        color: COLORS.white, borderRadius: "4px",
                        padding: "1px 6px", fontWeight: 700,
                    }}>
                        *
                    </span>
                )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {isComplete && (
                    <FiCheckCircle style={{ color: isOpen ? "#86efac" : COLORS.success, fontSize: "16px" }} />
                )}
                {isOpen ? <FiChevronUp /> : <FiChevronDown />}
            </div>
        </button>

        {isOpen && (
            <div style={{ padding: "20px", background: COLORS.white }}>
                {children}
            </div>
        )}
    </div>
);

// ── Champ texte standard ──────────────────────────────────────────────────────
interface FieldProps {
    label: string;
    isPrefilled?: boolean;
    required?: boolean;
    children: React.ReactNode;
    hint?: string;
}

const Field = ({ label, isPrefilled, required, children, hint }: FieldProps) => {
    const { t } = useTranslation();
    return (
        <div style={{ marginBottom: "16px" }}>
            <label style={{
                display: "block", marginBottom: "6px",
                fontSize: "13px", fontWeight: 600, color: COLORS.gray700,
            }}>
                {label}
                {required && <span style={{ color: COLORS.danger, marginLeft: "3px" }}>*</span>}
                {isPrefilled && <PrefilledBadge t={t} />}
            </label>
            {children}
            {hint && (
                <p style={{ fontSize: "11px", color: COLORS.gray400, marginTop: "4px" }}>{hint}</p>
            )}
        </div>
    );
};

// ── Input stylisé ─────────────────────────────────────────────────────────────
const StyledInput = ({
    value, onChange, placeholder, type = "text", prefilled = false, disabled = false
}: {
    value: string | number | undefined;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
    prefilled?: boolean;
    disabled?: boolean;
}) => (
    <input
        type={type}
        value={value ?? ""}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
            width: "100%",
            padding: "9px 12px",
            border: `1px solid ${prefilled ? COLORS.prefillBorder : COLORS.gray300}`,
            borderRadius: "6px",
            fontSize: "13px",
            background: prefilled ? COLORS.prefill : (disabled ? COLORS.gray100 : COLORS.white),
            color: disabled ? COLORS.gray500 : COLORS.gray800,
            outline: "none",
            transition: "border-color 0.15s",
        }}
        onFocus={e => { e.currentTarget.style.borderColor = COLORS.primary; }}
        onBlur={e => { e.currentTarget.style.borderColor = prefilled ? COLORS.prefillBorder : COLORS.gray300; }}
    />
);

// ── Textarea stylisé ──────────────────────────────────────────────────────────
const StyledTextarea = ({
    value, onChange, placeholder, rows = 4, prefilled = false
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    rows?: number;
    prefilled?: boolean;
}) => (
    <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
            width: "100%",
            padding: "9px 12px",
            border: `1px solid ${prefilled ? COLORS.prefillBorder : COLORS.gray300}`,
            borderRadius: "6px",
            fontSize: "13px",
            background: prefilled ? COLORS.prefill : COLORS.white,
            color: COLORS.gray800,
            outline: "none",
            resize: "vertical",
            transition: "border-color 0.15s",
            fontFamily: "inherit",
        }}
        onFocus={e => { e.currentTarget.style.borderColor = COLORS.primary; }}
        onBlur={e => { e.currentTarget.style.borderColor = prefilled ? COLORS.prefillBorder : COLORS.gray300; }}
    />
);

// ── Liste éditable (modules / objectifs / résultats...) ───────────────────────
const EditableList = ({
    items, onAdd, onUpdate, onRemove, placeholder, addLabel,
}: {
    items: string[];
    onAdd: () => void;
    onUpdate: (index: number, value: string) => void;
    onRemove: (index: number) => void;
    placeholder?: string;
    addLabel: string;
}) => (
    <div>
        {items.map((item, index) => (
            <div key={index} style={{
                display: "flex", gap: "8px", marginBottom: "8px", alignItems: "center",
            }}>
                <span style={{
                    minWidth: "24px", height: "24px", borderRadius: "50%",
                    background: COLORS.primary, color: COLORS.white,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: 700, flexShrink: 0,
                }}>
                    {index + 1}
                </span>
                <input
                    value={item}
                    onChange={e => onUpdate(index, e.target.value)}
                    placeholder={placeholder}
                    style={{
                        flex: 1, padding: "8px 12px",
                        border: `1px solid ${COLORS.gray300}`,
                        borderRadius: "6px", fontSize: "13px",
                        color: COLORS.gray800, outline: "none",
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = COLORS.primary; }}
                    onBlur={e => { e.currentTarget.style.borderColor = COLORS.gray300; }}
                />
                <button
                    type="button"
                    onClick={() => onRemove(index)}
                    style={{
                        padding: "6px", border: `1px solid ${COLORS.dangerLight}`,
                        borderRadius: "6px", background: COLORS.dangerLight,
                        color: COLORS.danger, cursor: "pointer",
                        display: "flex", alignItems: "center",
                    }}
                >
                    <FiTrash2 size={14} />
                </button>
            </div>
        ))}
        <button
            type="button"
            onClick={onAdd}
            style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "8px 14px",
                border: `1px dashed ${COLORS.primaryLight}`,
                borderRadius: "6px", background: COLORS.primaryFaded,
                color: COLORS.primaryLight, cursor: "pointer",
                fontSize: "13px", fontWeight: 500, marginTop: "4px",
            }}
        >
            <FiPlus size={14} /> {addLabel}
        </button>
    </div>
);

// ── Tableau budget (lecture seule) ────────────────────────────────────────────
const BudgetTable = ({ budget, lang }: { budget: any; lang: string }) => {
    const { t } = useTranslation();
    const fmt = (n: number) => n.toLocaleString("fr-FR");

    if (!budget?.lignes?.length) {
        return (
            <div style={{
                padding: "24px", textAlign: "center",
                background: COLORS.gray50, borderRadius: "8px",
                border: `1px dashed ${COLORS.gray300}`,
                color: COLORS.gray500, fontSize: "13px",
            }}>
                <FiAlertCircle style={{ fontSize: "20px", marginBottom: "8px", display: "block", margin: "0 auto 8px" }} />
                {t("tdr.budget_vide")}
            </div>
        );
    }

    return (
        <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                    <tr style={{ background: COLORS.primary, color: COLORS.white }}>
                        {["N°", t("tdr.nature_depense"), t("tdr.type"), t("tdr.quantite"),
                            t("tdr.prix_ht"), t("tdr.taxes"), t("tdr.montant_ttc")].map((h, i) => (
                            <th key={i} style={{
                                padding: "10px 8px", textAlign: i >= 3 ? "center" : "left",
                                fontWeight: 600, fontSize: "12px",
                                borderBottom: `2px solid ${COLORS.primaryLight}`,
                            }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {budget.lignes.map((ligne: any, i: number) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? COLORS.white : COLORS.gray50 }}>
                            <td style={{ padding: "8px", textAlign: "center", color: COLORS.gray500 }}>{i + 1}</td>
                            <td style={{ padding: "8px" }}>{ligne.nature}</td>
                            <td style={{ padding: "8px", textAlign: "center" }}>{ligne.type}</td>
                            <td style={{ padding: "8px", textAlign: "center" }}>{ligne.quantite}</td>
                            <td style={{ padding: "8px", textAlign: "right", fontFamily: "monospace" }}>
                                {fmt(ligne.prixUnitaireHT)}
                            </td>
                            <td style={{ padding: "8px", textAlign: "center" }}>{ligne.tauxTaxes}%</td>
                            <td style={{
                                padding: "8px", textAlign: "right",
                                fontWeight: 700, fontFamily: "monospace", color: COLORS.primary,
                            }}>
                                {fmt(ligne.montantTTC)}
                            </td>
                        </tr>
                    ))}
                    <tr style={{ background: "#dbeafe", fontWeight: 700 }}>
                        <td colSpan={4} style={{ padding: "10px 8px", textAlign: "center" }}>
                            {t("tdr.total_general")}
                        </td>
                        <td style={{ padding: "10px 8px", textAlign: "right", fontFamily: "monospace" }}>
                            {fmt(budget.totalPrevuHT)} FCFA
                        </td>
                        <td />
                        <td style={{ padding: "10px 8px", textAlign: "right", fontFamily: "monospace", color: COLORS.primary }}>
                            {fmt(budget.totalPrevuTTC)} FCFA
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

// ══════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ══════════════════════════════════════════════════════════════════

const GenerateurTDR = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const lang = useSelector((state: RootState) => state.setting.language);
    const currentUser = useSelector((state: RootState) => state.utilisateurSlice?.utilisateur);
    const selectedTheme = useSelector((state: RootState) => state.themeFormationSlice.selectedTheme);
    const tdr = useSelector((state: RootState) => state.tdrSlice);

    // Sections ouvertes
    const [openSections, setOpenSections] = useState<Set<string>>(new Set(["identification"]));
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const toggleSection = (id: string) => {
        setOpenSections(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    // Redirection si pas de thème sélectionné
    useEffect(() => {
        if (!selectedTheme) {
            navigate("/elaboration-programme/formation/themes-formation");
        }
    }, []);

    // Chargement du prefill
    useEffect(() => {
        if (!selectedTheme?._id) return;

        dispatch(resetTDR());
        dispatch(setTDRLoading(true));
        dispatch(setTDRError(null));

        getTDRPrefill(selectedTheme._id, lang)
            .then(data => {
                dispatch(setTDRPrefill({
                    ...data,
                    decoupageHoraire: deserializerDecoupage(data.decoupageHoraire as string),
                }));
            })
            .catch(() => {
                dispatch(setTDRError(t("tdr.erreur_chargement")));
            })
            .finally(() => {
                dispatch(setTDRLoading(false));
            });
    }, [selectedTheme?._id, lang]);

    // Helper pour update champ simple
    const upd = useCallback(<K extends keyof typeof tdr>(field: K, value: any) => {
        dispatch(updateTDRField({ field: field as any, value }));
    }, [dispatch]);

    const serializerDecoupage = (d: DecoupageHoraire): string => {
        if (!d.horaireGlobal && d.plages.length === 0) return "";

        const lignes: string[] = [];
        if (d.horaireGlobal) lignes.push(`HORAIRE: ${d.horaireGlobal}`);

        d.plages.forEach((plage, i) => {
            if (plage.horaire) lignes.push(`PERIODE: ${plage.horaire}`);
            plage.modules.forEach(mod => {
                // Préfixe différencié : MODULE vs ACTIVITE
                const prefixe = mod.termePrefere === 'activite' ? 'ACTIVITE' : 'MODULE';
                if (mod.texte) lignes.push(`${prefixe}: ${mod.texte}`);
            });
            // Pause après la plage (sauf la dernière)
            if (plage.pauseApres && i < d.plages.length - 1) {
                lignes.push(`PAUSE: ${plage.pauseApres}`);
            }
        });

        return lignes.join('\n');
    };

    const deserializerDecoupage = (raw: string): DecoupageHoraire => {
        if (!raw) return { horaireGlobal: "", plages: [] };

        const result: DecoupageHoraire = { horaireGlobal: "", plages: [] };
        let currentPlage: Plage | null = null;

        raw.split('n').forEach(ligne => {
            ligne = ligne.trim();
            if (!ligne) return;

            if (ligne.toUpperCase().startsWith('HORAIRE:')) {
                result.horaireGlobal = ligne.replace(/^horaire:/i, '').trim();

            } else if (ligne.toUpperCase().startsWith('PERIODE:') || ligne.toUpperCase().startsWith('PÉRIODE:')) {
                currentPlage = {
                    id: Date.now().toString() + Math.random(),
                    horaire: ligne.replace(/^p[eé]riode:/i, '').trim(),
                    modules: [],
                };
                result.plages.push(currentPlage);

            } else if (ligne.toUpperCase().startsWith('MODULE:')) {
                const texte = ligne.replace(/^module:/i, '').trim();
                if (currentPlage) {
                    currentPlage.modules.push({ id: Date.now().toString() + Math.random(), texte, termePrefere: 'module' });
                }

            } else if (ligne.toUpperCase().startsWith('ACTIVITE:')) {
                const texte = ligne.replace(/^activite:/i, '').trim();
                if (currentPlage) {
                    currentPlage.modules.push({ id: Date.now().toString() + Math.random(), texte, termePrefere: 'activite' });
                }

            } else if (ligne.toUpperCase().startsWith('PAUSE:')) {
                const textePause = ligne.replace(/^pause:/i, '').trim();
                // Attacher la pause à la plage précédente
                if (currentPlage) {
                    currentPlage.pauseApres = textePause;
                }
            }
        });

        return result;
    };

    // Génération du PDF
    const handleGenerate = async () => {
        if (!selectedTheme?._id || !currentUser?._id) return;

        dispatch(setTDRGenerating(true));
        dispatch(setTDRError(null));
        setSuccessMsg(null);

        const payload: TDRGeneratePayload = {
            titreFr: tdr.titreFr,
            titreEn: tdr.titreEn,
            dateDebut: tdr.dateDebut,
            dateFin: tdr.dateFin,
            duree: tdr.duree,
            responsable: typeof tdr.responsable === "object" ? tdr.responsable?._id : tdr.responsable,
            lieu: tdr.lieu,
            formateurs: tdr.formateurs.map((f: { utilisateur: any; interne: any; }) => ({
                utilisateur: typeof f.utilisateur === "object" ? (f.utilisateur as any)._id : f.utilisateur,
                interne: f.interne,
            })),
            objectifsSpecifiques: tdr.objectifsSpecifiques,
            nombreParticipants: tdr.nombreParticipants,
            objectifGeneral: tdr.objectifGeneral,
            contexte: tdr.contexte,
            modules: tdr.modules,
            responsabilitesDGI: tdr.responsabilitesDGI,
            responsabilitesPartieExterne: tdr.responsabilitesPartieExterne,
            nomPartieExterne: tdr.nomPartieExterne,
            resultatsAttendus: tdr.resultatsAttendus,
            methodologie: tdr.methodologie,
            decoupageHoraire: serializerDecoupage(tdr.decoupageHoraire),
            organisationGroupes: tdr.organisationGroupes,
            creePar: currentUser._id,
        };

        try {
            const blob = await genererTDR(selectedTheme._id, payload, lang);
            const nom = `TDR-${(tdr.titreFr || "formation").replace(/[^a-z0-9]/gi, "_").substring(0, 40)}.pdf`;
            downloadPDFBlob(blob, nom);
            setSuccessMsg(t("tdr.succes_generation"));
        } catch {
            dispatch(setTDRError(t("tdr.erreur_generation")));
        } finally {
            dispatch(setTDRGenerating(false));
        }
    };

    // ── Rendu ─────────────────────────────────────────────────────────────────

    if (tdr.isLoading) {
        return (
            <div style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                minHeight: "400px", gap: "16px",
            }}>
                <FiLoader style={{ fontSize: "32px", color: COLORS.primary, animation: "spin 1s linear infinite" }} />
                <p style={{ color: COLORS.gray500, fontSize: "14px" }}>{t("tdr.chargement")}</p>
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    const themeName = lang === "en" ? (tdr.titreEn || tdr.titreFr) : (tdr.titreFr || tdr.titreEn);

    return (
        <>
            <BreadcrumbPageDescription
                pageDescription={t("tdr.description_page")}
                titleColor="text-[#1e3a8a]"
                pageName={t("tdr.titre_page")}
                breadcrumbItems={[
                    { isActive: false, name: t("sub_menu.themes_formations"), path: "/elaboration-programme/formation/themes-formation" },
                    { isActive: true, name: t("tdr.titre_page"), path: "#" },
                ]}
            />

            <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 16px 40px" }}>

                {/* ── En-tête thème ── */}
                <div style={{
                    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
                    borderRadius: "12px",
                    padding: "20px 24px",
                    marginBottom: "20px",
                    color: COLORS.white,
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                }}>
                    <div style={{
                        background: "rgba(255,255,255,0.15)",
                        borderRadius: "10px",
                        padding: "12px",
                        flexShrink: 0,
                    }}>
                        <FiFileText size={24} />
                    </div>
                    <div>
                        <p style={{ fontSize: "11px", fontWeight: 500, opacity: 0.8, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>
                            {t("tdr.termes_de_reference")}
                        </p>
                        <h2 style={{ fontSize: "16px", fontWeight: 700, margin: 0 }}>{themeName}</h2>
                    </div>
                    {tdr.isDirty && (
                        <span style={{
                            marginLeft: "auto", fontSize: "11px",
                            background: "rgba(255,255,255,0.2)",
                            padding: "4px 10px", borderRadius: "20px",
                        }}>
                            {t("tdr.modifications_non_sauvegardees")}
                        </span>
                    )}
                </div>

                {/* ── Légende prefill ── */}
                <div style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "10px 14px",
                    background: COLORS.warningLight,
                    border: `1px solid ${COLORS.prefillBorder}`,
                    borderRadius: "8px",
                    marginBottom: "16px",
                    fontSize: "12px",
                    color: COLORS.gray700,
                }}>
                    <FiInfo style={{ color: COLORS.warning, flexShrink: 0 }} />
                    <span>
                        <strong style={{ color: COLORS.warning }}>{t("tdr.depuis_bd")}</strong>{" "}
                        {t("tdr.legende_prefill")}
                    </span>
                </div>

                {/* ── Alertes ── */}
                {tdr.error && (
                    <div style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        padding: "12px 16px", marginBottom: "16px",
                        background: COLORS.dangerLight, border: `1px solid #fca5a5`,
                        borderRadius: "8px", color: COLORS.danger, fontSize: "13px",
                    }}>
                        <FiAlertCircle />
                        {tdr.error}
                    </div>
                )}
                {successMsg && (
                    <div style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        padding: "12px 16px", marginBottom: "16px",
                        background: COLORS.successLight, border: `1px solid #6ee7b7`,
                        borderRadius: "8px", color: COLORS.success, fontSize: "13px",
                    }}>
                        <FiCheckCircle /> {successMsg}
                    </div>
                )}

                {/* ══ SECTION 1 — Identification ══ */}
                <Section
                    id="identification"
                    title={`1. ${t("tdr.section_identification")}`}
                    icon={<FiInfo />}
                    isOpen={openSections.has("identification")}
                    onToggle={() => toggleSection("identification")}
                    isComplete={!!(tdr.titreFr && tdr.dateDebut && tdr.dateFin)}
                    isRequired
                >
                    {/* Titre */}
                    <div style={{ marginBottom: "16px" }}>
                        <Field label={t("tdr.titre")} isPrefilled required>
                            <StyledInput
                                value={lang === 'fr' ? tdr.titreFr : tdr.titreEn}
                                onChange={v => {
                                    upd("titreFr", v);
                                    upd("titreEn", v);
                                }}
                                prefilled
                                placeholder={t("tdr.titre_fr_placeholder")}
                            />
                        </Field>
                    </div>

                    {/* Grille dates / durée / responsable */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <Field label={t("tdr.date_debut")} isPrefilled={!!tdr.dateDebut} required>
                            <StyledInput
                                type="date"
                                value={tdr.dateDebut?.split("T")[0] || ""}
                                onChange={v => upd("dateDebut", v)}
                                prefilled={!!tdr.dateDebut}
                            />
                        </Field>
                        <Field label={t("tdr.date_fin")} isPrefilled={!!tdr.dateFin} required>
                            <StyledInput
                                type="date"
                                value={tdr.dateFin?.split("T")[0] || ""}
                                onChange={v => upd("dateFin", v)}
                                prefilled={!!tdr.dateFin}
                            />
                        </Field>
                        <Field label={t("tdr.duree_heures")} isPrefilled={!!tdr.duree}>
                            <StyledInput
                                type="number"
                                value={tdr.duree ?? ""}
                                onChange={v => upd("duree", v ? Number(v) : null)}
                                prefilled={!!tdr.duree}
                                placeholder="ex: 6"
                            />
                        </Field>
                        <Field label={t("tdr.responsable")} isPrefilled={!!tdr.responsable}>
                            <StyledInput
                                value={tdr.responsable
                                    ? `${(tdr.responsable as any).nom} ${(tdr.responsable as any).prenom || ""}`
                                    : ""}
                                onChange={() => {}}
                                prefilled={!!tdr.responsable}
                                disabled
                                placeholder={t("tdr.responsable_placeholder")}
                            />
                        </Field>
                    </div>

                    {/* Participants et groupes */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginTop: "4px" }}>
                        <Field label={t("tdr.nombre_participants")} isPrefilled hint={t("tdr.participants_hint")}>
                            <StyledInput
                                type="number"
                                value={tdr.nombreParticipants}
                                onChange={v => upd("nombreParticipants", Number(v))}
                                prefilled
                            />
                        </Field>
                        <Field label={t("tdr.nombre_groupes")} isPrefilled={tdr.nombreGroupes > 0} hint={t("tdr.groupes_hint")}>
                            <StyledInput
                                type="number"
                                value={tdr.nombreGroupes ?? ""}
                                onChange={v => upd("nombreGroupes", Number(v))}
                                prefilled={tdr.nombreGroupes > 0}
                                placeholder="ex: 5"
                            />
                        </Field>
                        <Field label={t("tdr.participants_par_groupe")} isPrefilled={tdr.nombreParticipantsParGroupe > 0} hint={t("tdr.participants_par_groupe_hint")}>
                            <StyledInput
                                type="number"
                                value={tdr.nombreParticipantsParGroupe ?? ""}
                                onChange={v => upd("nombreParticipantsParGroupe", Number(v))}
                                prefilled={tdr.nombreParticipantsParGroupe > 0}
                                placeholder="ex: 40"
                            />
                        </Field>
                    </div>
                </Section>

                {/* ══ SECTION 2 — Contexte ══ */}
                <Section
                    id="contexte"
                    title={`1. ${t("tdr.section_contexte")}`}
                    icon={<FiBook />}
                    isOpen={openSections.has("contexte")}
                    onToggle={() => toggleSection("contexte")}
                    isComplete={!!tdr.contexte.trim()}
                >
                    <Field label={t("tdr.contexte_label")} hint={t("tdr.contexte_hint")}>
                        <StyledTextarea
                            value={tdr.contexte}
                            onChange={v => upd("contexte", v)}
                            placeholder={t("tdr.contexte_placeholder")}
                            rows={6}
                        />
                    </Field>
                </Section>

                {/* ══ SECTION 3 — Objectifs ══ */}
                <Section
                    id="objectifs"
                    title={`2. ${t("tdr.section_objectifs")}`}
                    icon={<FiTarget />}
                    isOpen={openSections.has("objectifs")}
                    onToggle={() => toggleSection("objectifs")}
                    isComplete={!!tdr.objectifGeneral.trim()}
                >
                    <Field label={t("tdr.objectif_general")} required>
                        <StyledTextarea
                            value={tdr.objectifGeneral}
                            onChange={v => upd("objectifGeneral", v)}
                            placeholder={t("tdr.objectif_general_placeholder")}
                            rows={3}
                        />
                    </Field>

                    <Field
                        label={t("tdr.objectifs_specifiques")}
                        isPrefilled={tdr.objectifsSpecifiques.length > 0}
                        hint={t("tdr.objectifs_specifiques_hint")}
                    >
                        {tdr.objectifsSpecifiques.map((obj, i) => (
                            <div key={i} style={{
                                display: "flex", gap: "8px", marginBottom: "8px",
                            }}>
                                <span style={{
                                    minWidth: "24px", height: "24px", borderRadius: "50%",
                                    background: COLORS.accent, color: COLORS.white,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "11px", fontWeight: 700, flexShrink: 0, marginTop: "8px",
                                }}>{i + 1}</span>
                                <div style={{ flex: 1 }}>
                                    <input
                                        value={lang === "en" ? obj.nomEn : obj.nomFr}
                                        onChange={e => dispatch(updateObjectif({
                                            index: i,
                                            value: lang === "en"
                                                ? { ...obj, nomEn: e.target.value }
                                                : { ...obj, nomFr: e.target.value },
                                        }))}
                                        style={{
                                            width: "100%", padding: "8px 12px",
                                            border: `1px solid ${COLORS.prefillBorder}`,
                                            borderRadius: "6px", fontSize: "13px",
                                            background: COLORS.prefill,
                                        }}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => dispatch(removeObjectif(i))}
                                    style={{
                                        padding: "6px", border: `1px solid ${COLORS.dangerLight}`,
                                        borderRadius: "6px", background: COLORS.dangerLight,
                                        color: COLORS.danger, cursor: "pointer", marginTop: "2px",
                                    }}
                                >
                                    <FiTrash2 size={14} />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => dispatch(addObjectif({ nomFr: "", nomEn: "" }))}
                            style={{
                                display: "flex", alignItems: "center", gap: "6px",
                                padding: "8px 14px",
                                border: `1px dashed ${COLORS.primaryLight}`,
                                borderRadius: "6px", background: COLORS.primaryFaded,
                                color: COLORS.primaryLight, cursor: "pointer",
                                fontSize: "13px", fontWeight: 500,
                            }}
                        >
                            <FiPlus size={14} /> {t("tdr.ajouter_objectif")}
                        </button>
                    </Field>
                </Section>

                {/* ══ SECTION 4 — Contenu / Modules ══ */}
                <Section
                    id="modules"
                    title={`3. ${t("tdr.section_modules")}`}
                    icon={<FiSettings />}
                    isOpen={openSections.has("modules")}
                    onToggle={() => toggleSection("modules")}
                    isComplete={tdr.modules.length > 0}
                >
                    <EditableList
                        items={tdr.modules}
                        onAdd={() => dispatch(addModule(""))}
                        onUpdate={(i, v) => dispatch(updateModule({ index: i, value: v }))}
                        onRemove={i => dispatch(removeModule(i))}
                        placeholder={t("tdr.module_placeholder")}
                        addLabel={t("tdr.ajouter_module")}
                    />
                </Section>

                {/* ══ SECTION 5 — Organisation ══ */}
                <Section
                    id="organisation"
                    title={`4. ${t("tdr.section_organisation")}`}
                    icon={<FiCalendar />}
                    isOpen={openSections.has("organisation")}
                    onToggle={() => toggleSection("organisation")}
                    isComplete={!!tdr.methodologie.trim()}
                >
                    {/* ── Lieux et périodes ── */}
                    <Field
                        label={t("tdr.lieux_periodes")}
                        isPrefilled={tdr.lieux.length > 0}
                        hint={t("tdr.lieux_periodes_hint")}
                    >
                        {tdr.lieux.length === 0 ? (
                            <p style={{ fontSize: "13px", color: COLORS.gray400, fontStyle: "italic" }}>
                                {t("tdr.aucun_lieu")}
                            </p>
                        ) : (
                            <div>
                                {tdr.lieux.map((lieu, i) => (
                                    <div key={lieu._id || i} style={{
                                        display: "grid", gridTemplateColumns: "2fr 1fr 1fr",
                                        gap: "8px", marginBottom: "8px", alignItems: "center",
                                        padding: "10px", background: COLORS.prefill,
                                        border: `1px solid ${COLORS.prefillBorder}`, borderRadius: "6px",
                                    }}>
                                        <div>
                                            <label style={{ fontSize: "11px", fontWeight: 600, color: COLORS.gray500, display: "block", marginBottom: "3px" }}>
                                                {t("tdr.lieu")} {i + 1}
                                            </label>
                                            <input
                                                value={lieu.lieu}
                                                onChange={e => {
                                                    const updated = [...tdr.lieux];
                                                    updated[i] = { ...updated[i], lieu: e.target.value };
                                                    upd("lieux", updated);
                                                }}
                                                style={{
                                                    width: "100%", padding: "7px 10px",
                                                    border: `1px solid ${COLORS.prefillBorder}`,
                                                    borderRadius: "5px", fontSize: "13px",
                                                    background: COLORS.white,
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: "11px", fontWeight: 600, color: COLORS.gray500, display: "block", marginBottom: "3px" }}>
                                                {t("tdr.date_debut")}
                                            </label>
                                            <input
                                                type="date"
                                                value={lieu.dateDebut?.split("T")[0] || ""}
                                                onChange={e => {
                                                    const updated = [...tdr.lieux];
                                                    updated[i] = { ...updated[i], dateDebut: e.target.value };
                                                    upd("lieux", updated);
                                                }}
                                                style={{
                                                    width: "100%", padding: "7px 10px",
                                                    border: `1px solid ${COLORS.prefillBorder}`,
                                                    borderRadius: "5px", fontSize: "13px",
                                                    background: COLORS.white,
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: "11px", fontWeight: 600, color: COLORS.gray500, display: "block", marginBottom: "3px" }}>
                                                {t("tdr.date_fin")}
                                            </label>
                                            <input
                                                type="date"
                                                value={lieu.dateFin?.split("T")[0] || ""}
                                                onChange={e => {
                                                    const updated = [...tdr.lieux];
                                                    updated[i] = { ...updated[i], dateFin: e.target.value };
                                                    upd("lieux", updated);
                                                }}
                                                style={{
                                                    width: "100%", padding: "7px 10px",
                                                    border: `1px solid ${COLORS.prefillBorder}`,
                                                    borderRadius: "5px", fontSize: "13px",
                                                    background: COLORS.white,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Field>
                    {/* ── Effectifs et groupes ── */}
                    <Field label={t("tdr.organisation_groupes")} hint={t("tdr.organisation_groupes_hint")}>
                        <StyledTextarea
                            value={tdr.organisationGroupes}
                            onChange={v => upd("organisationGroupes", v)}
                            placeholder={t("tdr.organisation_groupes_placeholder")}
                            rows={3}
                        />
                    </Field>

                    {/* ── Méthodologie ── */}
                    <Field label={t("tdr.methodologie")}>
                        <StyledTextarea
                            value={tdr.methodologie}
                            onChange={v => upd("methodologie", v)}
                            placeholder={t("tdr.methodologie_placeholder")}
                            rows={3}
                        />
                    </Field>
                    
                    {/* ══ DÉCOUPAGE HORAIRE ══ */}
                    <div style={{ marginTop: "8px" }}>
                        <label style={{
                            display: "block", marginBottom: "8px",
                            fontSize: "13px", fontWeight: 600, color: COLORS.gray700,
                        }}>
                            {t("tdr.decoupage_horaire")}
                            <span style={{ fontSize: "11px", fontWeight: 400, color: COLORS.gray400, marginLeft: "8px" }}>
                                {t("tdr.decoupage_horaire_hint")}
                            </span>
                        </label>

                        {/* Horaire global — unique */}
                        <div style={{
                            padding: "12px 16px",
                            background: "#f0f4ff",
                            border: `1.5px solid ${COLORS.primary}`,
                            borderRadius: "8px",
                            marginBottom: "12px",
                        }}>
                            <label style={{ fontSize: "12px", fontWeight: 700, color: COLORS.primary, display: "block", marginBottom: "6px" }}>
                                ⏰ {t("tdr.horaire_global")}
                            </label>
                            <input
                                value={tdr.decoupageHoraire.horaireGlobal}
                                onChange={e => dispatch(setHoraireGlobal(e.target.value))}
                                placeholder={t("tdr.horaire_global_placeholder")}
                                style={{
                                    width: "100%", padding: "8px 12px",
                                    border: `1px solid ${COLORS.primary}40`,
                                    borderRadius: "6px", fontSize: "13px",
                                    background: COLORS.white,
                                }}
                            />
                        </div>

                        {/* Plages */}
                        {tdr.decoupageHoraire.plages.map((plage, plageIndex) => (
                            <div key={plage.id} style={{ marginBottom: "10px" }}>

                                {/* Bloc plage */}
                                <div style={{
                                    padding: "12px 14px",
                                    background: "#f9fafb",
                                    border: `1px solid ${COLORS.gray200}`,
                                    borderLeft: `3px solid ${COLORS.accent}`,
                                    borderRadius: "0 8px 8px 0",
                                    marginLeft: "16px",
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                                        <span style={{
                                            fontSize: "11px", fontWeight: 700,
                                            color: COLORS.accent, whiteSpace: "nowrap",
                                        }}>
                                            ▸ {t("tdr.plage")} {plageIndex + 1}
                                        </span>
                                        <input
                                            value={plage.horaire}
                                            onChange={e => dispatch(updatePlage({ id: plage.id, horaire: e.target.value }))}
                                            placeholder={t("tdr.plage_horaire_placeholder")}
                                            style={{
                                                flex: 1, padding: "7px 10px",
                                                border: `1px solid ${COLORS.gray300}`,
                                                borderRadius: "5px", fontSize: "13px",
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => dispatch(removePlage(plage.id))}
                                            style={{
                                                padding: "6px", background: COLORS.dangerLight,
                                                border: `1px solid ${COLORS.dangerLight}`,
                                                borderRadius: "5px", color: COLORS.danger, cursor: "pointer",
                                            }}
                                        >
                                            <FiTrash2 size={13} />
                                        </button>
                                    </div>

                                    {/* Modules/Activités de cette plage */}
                                    {plage.modules.map((mod) => (
                                        <div key={mod.id} style={{
                                            display: "flex", gap: "6px", alignItems: "center",
                                            marginBottom: "6px", marginLeft: "20px",
                                        }}>
                                            {/* Sélecteur Module / Activité */}
                                            <select
                                                value={mod.termePrefere}
                                                onChange={e => dispatch(updateModuleDansPlage({
                                                    plageId: plage.id,
                                                    moduleId: mod.id,
                                                    termePrefere: e.target.value as 'module' | 'activite',
                                                }))}
                                                style={{
                                                    padding: "6px 4px", fontSize: "11px",
                                                    border: `1px solid ${COLORS.gray300}`,
                                                    borderRadius: "5px", background: COLORS.white,
                                                    color: COLORS.gray600, flexShrink: 0,
                                                    cursor: "pointer",
                                                }}
                                            >
                                                <option value="module">{t("tdr.module")}</option>
                                                <option value="activite">{t("tdr.activite")}</option>
                                            </select>

                                            <input
                                                value={mod.texte}
                                                onChange={e => dispatch(updateModuleDansPlage({
                                                    plageId: plage.id,
                                                    moduleId: mod.id,
                                                    texte: e.target.value,
                                                }))}
                                                placeholder={
                                                    mod.termePrefere === 'module'
                                                        ? t("tdr.module_placeholder")
                                                        : t("tdr.activite_placeholder")
                                                }
                                                style={{
                                                    flex: 1, padding: "7px 10px",
                                                    border: `1px solid ${COLORS.gray300}`,
                                                    borderRadius: "5px", fontSize: "13px",
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => dispatch(removeModuleDansPlage({ plageId: plage.id, moduleId: mod.id }))}
                                                style={{
                                                    padding: "5px", background: COLORS.dangerLight,
                                                    border: "none", borderRadius: "4px",
                                                    color: COLORS.danger, cursor: "pointer",
                                                }}
                                            >
                                                <FiTrash2 size={12} />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Ajouter module/activité */}
                                    <button
                                        type="button"
                                        onClick={() => dispatch(addModuleToPlage({ plageId: plage.id }))}
                                        style={{
                                            display: "flex", alignItems: "center", gap: "5px",
                                            marginLeft: "20px", marginTop: "4px",
                                            padding: "5px 10px",
                                            border: `1px dashed ${COLORS.accent}`,
                                            borderRadius: "5px", background: "#f0f9ff",
                                            color: COLORS.accent, cursor: "pointer",
                                            fontSize: "12px",
                                        }}
                                    >
                                        <FiPlus size={12} /> {t("tdr.ajouter_module_activite")}
                                    </button>
                                </div>

                                {/* Pause APRÈS cette plage (sauf après la dernière) */}
                                {plageIndex < tdr.decoupageHoraire.plages.length - 1 && (
                                    <div style={{
                                        display: "flex", alignItems: "center", gap: "8px",
                                        marginLeft: "16px", marginTop: "6px", marginBottom: "6px",
                                    }}>
                                        <span style={{
                                            fontSize: "11px", color: COLORS.gray500,
                                            whiteSpace: "nowrap", fontStyle: "italic",
                                        }}>
                                            ☕ {t("tdr.pause_apres")}
                                        </span>
                                        <input
                                            value={plage.pauseApres || ""}
                                            onChange={e => dispatch(setPlausePause({ plageId: plage.id, pause: e.target.value }))}
                                            placeholder={t("tdr.pause_placeholder")}
                                            style={{
                                                flex: 1, padding: "6px 10px",
                                                border: `1px dashed ${COLORS.gray300}`,
                                                borderRadius: "5px", fontSize: "12px",
                                                background: "#fffef0",
                                                fontStyle: "italic",
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Ajouter une plage */}
                        <button
                            type="button"
                            onClick={() => dispatch(addPlage())}
                            style={{
                                display: "flex", alignItems: "center", gap: "6px",
                                marginLeft: "16px", marginTop: "4px",
                                padding: "8px 14px",
                                border: `1px dashed ${COLORS.primaryLight}`,
                                borderRadius: "6px", background: COLORS.primaryFaded,
                                color: COLORS.primaryLight, cursor: "pointer",
                                fontSize: "13px", fontWeight: 500,
                            }}
                        >
                            <FiPlus size={14} /> {t("tdr.ajouter_plage")}
                        </button>
                    </div>
                </Section>

                {/* ══ SECTION 6 — Responsabilités ══ */}
                <Section
                    id="responsabilites"
                    title={`5. ${t("tdr.section_responsabilites")}`}
                    icon={<FiUsers />}
                    isOpen={openSections.has("responsabilites")}
                    onToggle={() => toggleSection("responsabilites")}
                    isComplete={!!tdr.responsabilitesDGI.trim()}
                >
                    <Field label={t("tdr.responsabilites_dgi")} hint={t("tdr.responsabilites_hint")}>
                        <StyledTextarea
                            value={tdr.responsabilitesDGI}
                            onChange={v => upd("responsabilitesDGI", v)}
                            placeholder={t("tdr.responsabilites_dgi_placeholder")}
                            rows={4}
                        />
                    </Field>
                    <Field label={t("tdr.nom_partie_externe")}>
                        <StyledInput
                            value={tdr.nomPartieExterne}
                            onChange={v => upd("nomPartieExterne", v)}
                            placeholder={t("tdr.nom_partie_externe_placeholder")}
                        />
                    </Field>
                    <Field label={t("tdr.responsabilites_partie_externe")} hint={t("tdr.responsabilites_hint")}>
                        <StyledTextarea
                            value={tdr.responsabilitesPartieExterne}
                            onChange={v => upd("responsabilitesPartieExterne", v)}
                            placeholder={t("tdr.responsabilites_partie_externe_placeholder")}
                            rows={4}
                        />
                    </Field>
                </Section>

                {/* ══ SECTION 7 — Résultats attendus ══ */}
                <Section
                    id="resultats"
                    title={`6. ${t("tdr.section_resultats")}`}
                    icon={<FiStar />}
                    isOpen={openSections.has("resultats")}
                    onToggle={() => toggleSection("resultats")}
                    isComplete={!!tdr.resultatsAttendus.trim()}
                >
                    <Field label={t("tdr.resultats_attendus")} hint={t("tdr.responsabilites_hint")}>
                        <StyledTextarea
                            value={tdr.resultatsAttendus}
                            onChange={v => upd("resultatsAttendus", v)}
                            placeholder={t("tdr.resultats_placeholder")}
                            rows={5}
                        />
                    </Field>
                </Section>

                {/* ══ SECTION 8 — Budget ══ */}
                <Section
                    id="budget"
                    title={`7. ${t("tdr.section_budget")}`}
                    icon={<FiDollarSign />}
                    isOpen={openSections.has("budget")}
                    onToggle={() => toggleSection("budget")}
                    isComplete={!!tdr.budget?.lignes?.length}
                >
                    <div style={{
                        display: "flex", alignItems: "center", gap: "8px",
                        padding: "8px 12px", background: COLORS.primaryFaded,
                        borderRadius: "6px", marginBottom: "12px",
                        fontSize: "12px", color: COLORS.primaryLight,
                    }}>
                        <FiInfo size={14} />
                        {t("tdr.budget_lecture_seule")}
                    </div>
                    <BudgetTable budget={tdr.budget} lang={lang} />
                </Section>

                {/* ── Bouton génération ── */}
                <div style={{
                    marginTop: "24px", display: "flex",
                    justifyContent: "flex-end", gap: "12px",
                }}>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        style={{
                            padding: "12px 24px",
                            border: `1px solid ${COLORS.gray300}`,
                            borderRadius: "8px",
                            background: COLORS.white,
                            color: COLORS.gray600,
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: 500,
                        }}
                    >
                        {t("button.annuler")}
                    </button>

                    <button
                        type="button"
                        onClick={handleGenerate}
                        disabled={tdr.isGenerating}
                        style={{
                            display: "flex", alignItems: "center", gap: "8px",
                            padding: "12px 28px",
                            background: tdr.isGenerating
                                ? COLORS.gray400
                                : `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
                            color: COLORS.white,
                            border: "none",
                            borderRadius: "8px",
                            cursor: tdr.isGenerating ? "not-allowed" : "pointer",
                            fontSize: "14px",
                            fontWeight: 600,
                            boxShadow: tdr.isGenerating ? "none" : `0 4px 14px rgba(30,58,138,0.3)`,
                            transition: "all 0.2s",
                        }}
                    >
                        {tdr.isGenerating ? (
                            <>
                                <FiLoader style={{ animation: "spin 1s linear infinite" }} />
                                {t("tdr.generation_en_cours")}
                            </>
                        ) : (
                            <>
                                <FiDownload size={16} />
                                {t("tdr.generer_pdf")}
                            </>
                        )}
                    </button>
                </div>
            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </>
    );
};

export default GenerateurTDR;