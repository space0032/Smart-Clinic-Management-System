// Role-based permissions configuration
export const ROLES = {
    ADMIN: 'ADMIN',
    DOCTOR: 'DOCTOR',
    RECEPTIONIST: 'RECEPTIONIST'
};

// Define which routes each role can access
export const PERMISSIONS = {
    [ROLES.ADMIN]: [
        '/', '/patients', '/doctors', '/appointments',
        '/medical-records', '/billing', '/reports', '/settings', '/search'
    ],
    [ROLES.DOCTOR]: [
        '/', '/patients', '/appointments', '/medical-records', '/settings', '/search'
    ],
    [ROLES.RECEPTIONIST]: [
        '/', '/patients', '/appointments', '/billing', '/settings', '/search'
    ]
};

// Navigation items with role restrictions
export const NAV_ITEMS = [
    { name: 'Dashboard', href: '/', roles: ['ADMIN', 'DOCTOR', 'RECEPTIONIST'] },
    { name: 'Patients', href: '/patients', roles: ['ADMIN', 'DOCTOR', 'RECEPTIONIST'] },
    { name: 'Doctors', href: '/doctors', roles: ['ADMIN'] },
    { name: 'Appointments', href: '/appointments', roles: ['ADMIN', 'DOCTOR', 'RECEPTIONIST'] },
    { name: 'Records', href: '/medical-records', roles: ['ADMIN', 'DOCTOR'] },
    { name: 'Prescriptions', href: '/prescriptions', roles: ['ADMIN', 'DOCTOR'] },
    { name: 'Billing', href: '/billing', roles: ['ADMIN', 'RECEPTIONIST'] },
    { name: 'Reports', href: '/reports', roles: ['ADMIN'] },
    { name: 'Settings', href: '/settings', roles: ['ADMIN', 'DOCTOR', 'RECEPTIONIST'] },
];

// Check if user has permission to access a route
export const hasPermission = (userRole, route) => {
    const allowedRoutes = PERMISSIONS[userRole] || PERMISSIONS[ROLES.RECEPTIONIST];
    return allowedRoutes.includes(route);
};

// Get user from localStorage
export const getUser = () => {
    try {
        return JSON.parse(localStorage.getItem('clinicUser') || '{}');
    } catch {
        return {};
    }
};

// Check if user can perform specific actions
export const canPerformAction = (userRole, action) => {
    const actionPermissions = {
        'delete_patient': ['ADMIN'],
        'delete_doctor': ['ADMIN'],
        'delete_appointment': ['ADMIN', 'RECEPTIONIST'],
        'create_bill': ['ADMIN', 'RECEPTIONIST'],
        'view_reports': ['ADMIN'],
        'manage_users': ['ADMIN'],
        'edit_medical_records': ['ADMIN', 'DOCTOR'],
        'create_appointment': ['ADMIN', 'DOCTOR', 'RECEPTIONIST'],
    };

    const allowedRoles = actionPermissions[action] || [];
    return allowedRoles.includes(userRole);
};
