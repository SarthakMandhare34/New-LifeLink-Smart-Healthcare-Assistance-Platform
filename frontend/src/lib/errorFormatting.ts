/**
 * ============================================================================
 * ERROR FORMATTING UTILITY (frontend/src/lib/errorFormatting.ts)
 * ============================================================================
 *
 * WHY THIS FILE IS SPECIAL:
 * Converts complex system errors, tRPC errors, and raw Zod validation JSON arrays
 * (e.g. `[{"code":"too_big","maximum":100...}]`) into human-readable, user-friendly
 * English explanations suitable for display directly in the UI.
 */

export function formatUserFriendlyError(error: unknown, fallbackMessage = 'An unexpected error occurred. Please try again.'): string {
  if (!error) return fallbackMessage;

  let rawMessage = '';
  if (typeof error === 'string') {
    rawMessage = error;
  } else if (error instanceof Error) {
    rawMessage = error.message;
  } else if (typeof error === 'object' && 'message' in error && typeof (error as any).message === 'string') {
    rawMessage = (error as any).message;
  }

  rawMessage = rawMessage.trim();
  if (!rawMessage) return fallbackMessage;

  // Check if rawMessage is a JSON-encoded Zod error array
  if ((rawMessage.startsWith('[') && rawMessage.endsWith(']')) || (rawMessage.startsWith('{') && rawMessage.endsWith('}'))) {
    try {
      const parsed = JSON.parse(rawMessage);
      const issues = Array.isArray(parsed) ? parsed : [parsed];
      if (issues.length > 0) {
        const issue = issues[0];
        const path = Array.isArray(issue.path) ? issue.path.join('.') : '';

        if (path === 'age' || issue.code === 'too_big' || issue.code === 'too_small') {
          return 'Please enter a valid age between 0 and 100 years.';
        }
        if (path === 'phone' || issue.message?.toLowerCase().includes('contact number') || issue.message?.toLowerCase().includes('phone')) {
          return 'Please enter a valid phone number (minimum 7 digits).';
        }
        if (path === 'scheduledAt' || issue.message?.toLowerCase().includes('scheduledat') || issue.message?.toLowerCase().includes('date')) {
          return 'Invalid date or time. Please select a future date and time for your appointment.';
        }
        if (path === 'symptoms') {
          return 'Please describe your symptoms clearly before proceeding.';
        }
        if (path === 'gender') {
          return 'Please select a biological gender (Male, Female, Other).';
        }
        if (path === 'bloodGroup') {
          return 'Please select a valid blood group (A+, A-, B+, B-, AB+, AB-, O+, O-).';
        }
        if (issue.message && typeof issue.message === 'string' && !issue.message.includes('{')) {
          return issue.message;
        }
      }
    } catch {
      // If JSON parsing fails, continue to string pattern matching
    }
  }

  // Common pattern replacements
  if (rawMessage.includes('Invalid date or time') || rawMessage.includes('must be in the future')) {
    return 'Invalid date or time. Please select a future date and time for your appointment.';
  }

  if (rawMessage.includes('Failed to fetch') || rawMessage.includes('NetworkError') || rawMessage.includes('ECONNREFUSED')) {
    return 'Unable to reach the server. Please check your network connection and try again.';
  }

  if (
    rawMessage.includes('patientAssessments') ||
    rawMessage.includes('foreign key') ||
    rawMessage.includes('Failed query') ||
    rawMessage.includes('ER_NO_REFERENCED_ROW') ||
    rawMessage.includes('PATIENT_USER_NOT_FOUND') ||
    rawMessage.includes('Patient account not found') ||
    rawMessage.includes('User account not found')
  ) {
    return 'Your session is invalid or your user account is no longer registered. Please sign in or register to record your health assessment.';
  }

  if (rawMessage.includes('UNAUTHORIZED') || rawMessage.includes('Unauthorized')) {
    return 'Your session has expired or is unauthorized. Please sign in again.';
  }

  if (rawMessage.includes('FORBIDDEN')) {
    return 'You do not have permission to perform this action.';
  }

  // Remove tRPC prefixes like "TRPCClientError: "
  return rawMessage.replace(/^TRPCClientError:\s*/i, '').replace(/^Error:\s*/i, '');
}
