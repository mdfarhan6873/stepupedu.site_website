'use client'
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import TeacherAttendance from '@/lib/models/TeacherAttendance';
import Teacher from '@/lib/models/Teacher';
import mongoose from 'mongoose';

// Remove teacher attendance POST and GET functionality
