import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. حفظ بيانات العميل في قاعدة البيانات (حسب الكود لديك)
    const newCustomer = await prisma.customer.create({
      data: {
        name: body.name,
        phone: body.phone,
        email: body.email,
        location: body.location,
      },
    });

    // 2. إرسال إشعار التيليجرام بالبيانات الصحيحة التي أنشأناها الآن
    const TELEGRAM_BOT_TOKEN = "8857116906:AAFRLO_9sP2UJWXHtlLWUj-CyqJLcE5dudc";
    const CHAT_ID = "7842160657";

   const message = `🚀 عميل جديد في منصة ركين!\n\n👤 الاسم: ${newCustomer.name}\n📞 الهاتف: ${newCustomer.phone}\n📧 البريد: ${newCustomer.email || 'غير متوفر'}\n📍 العنوان: ${newCustomer.location || 'غير متوفر'}`;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
      }),
    });

    return NextResponse.json({
      success: true,
      message: 'تم حفظ البيانات وإرسال إشعار تيليجرام بنجاح',
      customer: newCustomer,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Database Error:', error);
    return NextResponse.json({ success: false, message: 'خطأ في الخادم' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, customers });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'خطأ في جلب البيانات' }, { status: 500 });
  }
}