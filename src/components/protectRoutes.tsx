import React from 'react';
import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
  component: React.ReactElement; // Le composant à rendre si autorisé
  requiredPermission?: string[]; // Permissions nécessaires
  userPermissions: string[]; // Permissions de l'utilisateur
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component, requiredPermission, userPermissions }) => {
  // Vérifier si l'utilisateur possède au moins une des permissions requises
  if(!userPermissions || (userPermissions && userPermissions.length==0)){
    userPermissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
  }
  
  const hasPermission = requiredPermission && requiredPermission.some(permission => userPermissions.includes(permission));

  // return hasPermission ? component : <Navigate to="/unauthorized" replace />;
  return component ;
};



export default ProtectedRoute;
