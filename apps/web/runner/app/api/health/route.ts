'use server'

import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Simulate a health check by returning a simple response
        return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
    } catch (error) {
        console.error('Health check failed:', error);
        return NextResponse.json({ status: 'error', message: 'Health check failed' }, { status: 500 });
    }
}