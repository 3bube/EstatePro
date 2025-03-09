import api from "./api";

// Get admin dashboard statistics
export const getAdminDashboardStats = async () => {
  try {
    const response = await api.get("/admin/dashboard");
    return response.data;
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    throw error;
  }
};

// Get users list with optional filters
export const getAdminUsers = async (
  page = 1,
  limit = 10,
  filters?: { status?: string; role?: string; search?: string }
) => {
  try {
    let url = `/admin/users?page=${page}&limit=${limit}`;
    
    if (filters?.status) {
      url += `&status=${filters.status}`;
    }
    
    if (filters?.role) {
      url += `&role=${filters.role}`;
    }
    
    if (filters?.search) {
      url += `&search=${encodeURIComponent(filters.search)}`;
    }
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching admin users:", error);
    throw error;
  }
};

// Get user details by ID
export const getAdminUserDetails = async (userId: string) => {
  try {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};

// Update user status
export const updateUserStatus = async (userId: string, status: string) => {
  try {
    const response = await api.patch(`/admin/users/${userId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};

// Update user role
export const updateUserRole = async (userId: string, role: string) => {
  try {
    const response = await api.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

// Get properties list with optional filters
export const getAdminProperties = async (
  page = 1,
  limit = 10,
  filters?: { status?: string; type?: string; search?: string }
) => {
  try {
    let url = `/admin/properties?page=${page}&limit=${limit}`;
    
    if (filters?.status) {
      url += `&status=${filters.status}`;
    }
    
    if (filters?.type) {
      url += `&type=${filters.type}`;
    }
    
    if (filters?.search) {
      url += `&search=${encodeURIComponent(filters.search)}`;
    }
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching admin properties:", error);
    throw error;
  }
};

// Get transactions list with optional filters
export const getAdminTransactions = async (
  page = 1,
  limit = 10,
  filters?: { status?: string; dateRange?: string }
) => {
  try {
    let url = `/admin/transactions?page=${page}&limit=${limit}`;
    
    if (filters?.status) {
      url += `&status=${filters.status}`;
    }
    
    if (filters?.dateRange) {
      url += `&dateRange=${filters.dateRange}`;
    }
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching admin transactions:", error);
    throw error;
  }
};

// Get transaction details by ID
export const getAdminTransactionDetails = async (transactionId: string) => {
  try {
    const response = await api.get(`/admin/transactions/${transactionId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching transaction details:", error);
    throw error;
  }
};

// Update transaction status
export const updateTransactionStatus = async (transactionId: string, status: string) => {
  try {
    const response = await api.patch(`/admin/transactions/${transactionId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating transaction status:", error);
    throw error;
  }
};

// Get reports with optional filters
export const getAdminReports = async (
  reportType?: string,
  dateRange?: string
) => {
  try {
    let url = `/admin/reports`;
    const params = new URLSearchParams();
    
    if (reportType) {
      params.append('reportType', reportType);
    }
    
    if (dateRange) {
      params.append('dateRange', dateRange);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching admin reports:", error);
    throw error;
  }
};

// Get roles and permissions
export const getAdminRolesAndPermissions = async () => {
  try {
    const response = await api.get("/admin/roles");
    return response.data;
  } catch (error) {
    console.error("Error fetching roles and permissions:", error);
    throw error;
  }
};
