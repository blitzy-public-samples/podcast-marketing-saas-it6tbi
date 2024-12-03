/**
 * Human Tasks:
 * 1. Verify token validation settings with security team
 * 2. Confirm error logging configuration with DevOps
 * 3. Validate CORS settings for authentication endpoints
 * 4. Review rate limiting configuration for API endpoints
 */

// next/server v13.0.0
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, refreshToken } from './lib/auth';
import { handleApiError } from './lib/api';
import authSlice from './store/auth-slice';

/**
 * Requirement: User Management (1.3 Scope/Core Features and Functionalities/User Management)
 * Middleware to validate user authentication and refresh tokens if necessary.
 * @param request - The incoming Next.js request object
 * @returns A promise resolving to the Next.js response object
 */
export const authMiddleware = async (request: NextRequest): Promise<NextResponse> => {
  try {
    // Skip authentication for public routes
    const publicPaths = ['/login', '/register', '/forgot-password'];
    if (publicPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
      return NextResponse.next();
    }

    // Extract token from Authorization header or cookies
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '') || 
                 request.cookies.get('auth_token')?.value;

    if (!token) {
      return new NextResponse(
        JSON.stringify({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required'
          }
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Validate current user
    const user = getCurrentUser();
    if (!user) {
      // Attempt token refresh
      try {
        const refreshed = await refreshToken();
        if (!refreshed) {
          authSlice.actions.clearAuth();
          return new NextResponse(
            JSON.stringify({
              error: {
                code: 'TOKEN_EXPIRED',
                message: 'Session expired. Please login again.'
              }
            }),
            {
              status: 401,
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
        }
      } catch (error) {
        authSlice.actions.clearAuth();
        throw error;
      }
    }

    // Clone the request and add user context
    const requestWithUser = request.clone();
    requestWithUser.headers.set('X-User-ID', user?.id || '');
    requestWithUser.headers.set('X-User-Roles', user?.roles.join(',') || '');

    return NextResponse.next({
      request: requestWithUser
    });

  } catch (error) {
    console.error('[Auth Middleware] Error:', error);
    return new NextResponse(
      JSON.stringify({
        error: {
          code: 'AUTH_ERROR',
          message: 'Authentication failed'
        }
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};

/**
 * Requirement: API Design (8.3 API Design/8.3.2 Interface Specifications)
 * Middleware to handle API errors and map them to a consistent error structure.
 * @param request - The incoming Next.js request object
 * @returns A promise resolving to the Next.js response object
 */
export const errorHandlingMiddleware = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const response = await NextResponse.next();
    
    // Only handle API routes
    if (!request.nextUrl.pathname.startsWith('/api')) {
      return response;
    }

    // If response is successful, return as is
    if (response.ok) {
      return response;
    }

    // Handle API errors
    const error = await response.json();
    const handledError = handleApiError(error);

    // Log error for monitoring
    console.error('[API Error]', {
      path: request.nextUrl.pathname,
      method: request.method,
      error: handledError,
      timestamp: new Date().toISOString()
    });

    return new NextResponse(
      JSON.stringify(handledError),
      {
        status: handledError.statusCode,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('[Error Handling Middleware] Error:', error);
    return new NextResponse(
      JSON.stringify({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred'
        }
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};