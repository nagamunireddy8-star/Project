import { configureStore, createSlice } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const readSession = () => {
  try {
    return JSON.parse(localStorage.getItem('driven-session') || 'null')
  } catch {
    return null
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: () => {
    const session = readSession()
    return { token: session?.token || null, user: session?.user || null }
  },
  reducers: {
    setSession: (state, action) => {
      state.token = action.payload.token
      state.user = action.payload.user
      localStorage.setItem('driven-session', JSON.stringify(action.payload))
    },
    clearSession: (state) => {
      state.token = null
      state.user = null
      localStorage.removeItem('driven-session')
    },
  },
})

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:9999/api/v1',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token
    if (token) headers.set('authorization', `Bearer ${token}`)
    return headers
  },
})

const baseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions)
  if (result.error) {
    const message = result.error.data?.message || result.error.error || 'Could not connect to the rental service.'
    return { error: { ...result.error, message } }
  }
  const response = result.data
  if (response?.success === false) {
    return { error: { status: 'CUSTOM_ERROR', error: response.message, message: response.message } }
  }
  return { data: response?.data, meta: result.meta }
}

export const rentalApi = createApi({
  reducerPath: 'rentalApi',
  baseQuery,
  tagTypes: ['Vehicle', 'Booking', 'Dashboard', 'User', 'Report'],
  endpoints: (builder) => ({
    getVehicles: builder.query({
      query: ({ search } = {}) => ({ url: '/vehicles', params: search ? { search } : undefined }),
      providesTags: ['Vehicle'],
    }),
    getVehicle: builder.query({ query: (id) => `/vehicles/${id}`, providesTags: ['Vehicle'] }),
    createBooking: builder.mutation({
      query: (body) => ({ url: '/bookings', method: 'POST', body }),
      invalidatesTags: ['Vehicle', 'Booking', 'Dashboard', 'Report'],
    }),
    getMyBookings: builder.query({ query: () => '/bookings/my', providesTags: ['Booking'] }),
    getBooking: builder.query({ query: (id) => `/bookings/${id}`, providesTags: ['Booking'] }),
    cancelBooking: builder.mutation({
      query: (id) => ({ url: `/bookings/${id}/cancel`, method: 'PUT' }),
      invalidatesTags: ['Booking', 'Vehicle', 'Dashboard', 'Report'],
    }),
    startRental: builder.mutation({
      query: (id) => ({ url: `/rentals/${id}/start`, method: 'PUT' }),
      invalidatesTags: ['Booking', 'Vehicle'],
    }),
    returnRental: builder.mutation({
      query: (id) => ({ url: `/rentals/${id}/return`, method: 'PUT' }),
      invalidatesTags: ['Booking', 'Vehicle', 'Dashboard'],
    }),
    login: builder.mutation({ query: (body) => ({ url: '/auth/login', method: 'POST', body }) }),
    register: builder.mutation({ query: (body) => ({ url: '/auth/register', method: 'POST', body }) }),
    getMe: builder.query({ query: () => '/auth/me' }),
    getAdminDashboard: builder.query({ query: () => '/admin/dashboard', providesTags: ['Dashboard'] }),
    getAdminBookings: builder.query({ query: () => '/admin/bookings', providesTags: ['Booking'] }),
    getAdminUsers: builder.query({ query: () => '/admin/users', providesTags: ['User'] }),
    getAdminVehicles: builder.query({ query: () => '/admin/vehicles', providesTags: ['Vehicle'] }),
    getVehicleReport: builder.query({ query: () => '/reports/vehicles', providesTags: ['Report'] }),
    getBookingReport: builder.query({ query: () => '/reports/bookings', providesTags: ['Report'] }),
    createVehicle: builder.mutation({
      query: (body) => ({ url: '/vehicles', method: 'POST', body }),
      invalidatesTags: ['Vehicle', 'Dashboard'],
    }),
    updateVehicle: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/vehicles/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Vehicle', 'Dashboard'],
    }),
    deleteVehicle: builder.mutation({
      query: (id) => ({ url: `/vehicles/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Vehicle', 'Dashboard'],
    }),
    createVehicleRegistration: builder.mutation({
      query: (body) => ({ url: '/vehicle-registrations', method: 'POST', body }),
    }),
    getVehicleRegistration: builder.query({ query: (id) => `/vehicle-registrations/${id}` }),
  }),
})

export const { setSession, clearSession } = authSlice.actions
export const {
  useGetVehiclesQuery,
  useGetVehicleQuery,
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useGetBookingQuery,
  useCancelBookingMutation,
  useStartRentalMutation,
  useReturnRentalMutation,
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useGetAdminDashboardQuery,
  useGetAdminBookingsQuery,
  useGetAdminUsersQuery,
  useGetAdminVehiclesQuery,
  useGetVehicleReportQuery,
  useGetBookingReportQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
  useCreateVehicleRegistrationMutation,
  useGetVehicleRegistrationQuery,
} = rentalApi

export const store = configureStore({
  reducer: { auth: authSlice.reducer, [rentalApi.reducerPath]: rentalApi.reducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(rentalApi.middleware),
})
