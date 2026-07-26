import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. حفظ الكود لديك
    const newCustomer = await prisma.customer.create({
      data: {
        name: body.name,
        phone: body.phone,
        email: body.email,
        location: body.location,
      },
    });

    // 2. إرسال إشعار تليجرام بالبيانات
    const TELEGRAM_BOT_TOKEN = "8857116986:AAFRLO_9sP2UJWXHtllW5J-CyqJLcE5dudc";
    const CHAT_ID = "7842160657";

    const message = `عميل جديد في منصة ركين 🛒:\n\nالاسم: ${newCustomer.name}\nالهاتف: ${newCustomer.phone}`;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
      }),
    });

    return NextResponse.json({ success: true, message: "تم بنجاح", data: newCustomer }, { status: 200 });

  } catch (error: any) {
    console.error("خطأ في الخادم:", error);
    return NextResponse.json({ success: false, message: "خطأ في الخادم" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const customers = await prisma.customer.findMany();
    return NextResponse.json({ success: true, customers }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "خطأ في جلب البيانات" }, { status: 500 });
  }
}
