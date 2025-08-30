import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { account, session, twoFactor, user, verification } from '@/lib/schema';

export async function DELETE() {
  try {
    const userSession = await auth.api.getSession({ headers: await headers() });

    if (!userSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = userSession.user.id;

    await db.delete(twoFactor).where(eq(twoFactor.userId, userId));
    await db
      .delete(verification)
      .where(eq(verification.identifier, userSession.user.email));
    await db.delete(account).where(eq(account.userId, userId));
    await db.delete(session).where(eq(session.userId, userId));
    await db.delete(user).where(eq(user.id, userId));

    return NextResponse.json(
      { message: 'Account deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
