import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data for the dashboard that matches the expected structure
  const mockDashboardData = {
    stats: {
      totalEvents: 42,
      totalTicketsSold: 1250,
      totalRevenue: 62500,
      totalAttendees: 1180
    },
    upcomingEvents: [
      {
        id: "e12d3a4b-5c6d-7e8f-9g0h-1i2j3k4l5m6n",
        title: "Workshop de Desenvolvimento Web",
        description: "Aprenda as mais recentes tecnologias de desenvolvimento web",
        date: "2025-06-15",
        time: "09:00",
        location: "Centro de Convenções",
        imageUrl: "/images/events/workshop.jpg",
        price: 150.00,
        category: "Tecnologia",
        ticketsSold: 78
      },
      {
        id: "a1b2c3d4-e5f6-7g8h-9i0j-1k2l3m4n5o6p",
        title: "Conferência de Inovação",
        description: "Discussões sobre as últimas tendências em inovação",
        date: "2025-07-10",
        time: "14:00",
        location: "Hotel Grand Plaza",
        imageUrl: "/images/events/conference.jpg",
        price: 250.00,
        category: "Negócios",
        ticketsSold: 120
      }
    ],
    recentTransactions: [
      {
        id: "t1u2v3w4-x5y6-7z8a-9b0c-1d2e3f4g5h6i",
        eventId: "e12d3a4b-5c6d-7e8f-9g0h-1i2j3k4l5m6n",
        eventTitle: "Workshop de Desenvolvimento Web",
        userId: "u1s2e3r-4i5d6-7a8b9c0d1e2f",
        userName: "Maria Silva",
        purchaseDate: "2025-05-20T14:30:00Z",
        amount: 150.00,
        status: "completed"
      },
      {
        id: "j7k8l9m0-n1o2-3p4q-5r6s-7t8u9v0w1x2y",
        eventId: "a1b2c3d4-e5f6-7g8h-9i0j-1k2l3m4n5o6p",
        eventTitle: "Conferência de Inovação",
        userId: "a1n2o3t-4h5e6r-7u8s9e0r1i2d",
        userName: "João Santos",
        purchaseDate: "2025-05-19T10:15:00Z",
        amount: 250.00,
        status: "completed"
      }
    ],
    analytics: {
      ageGroups: {
        "18-24": 320,
        "25-34": 450,
        "35-44": 280,
        "45+": 130
      },
      ticketTrends: {
        daily: [45, 52, 38, 65, 72, 58, 63],
        weekly: [280, 310, 350, 290, 320],
        monthly: [850, 1050, 1250, 980, 1100, 1200]
      },
      popularEvents: [
        {
          id: "a1b2c3d4-e5f6-7g8h-9i0j-1k2l3m4n5o6p",
          title: "Conferência de Inovação",
          ticketsSold: 120
        },
        {
          id: "e12d3a4b-5c6d-7e8f-9g0h-1i2j3k4l5m6n",
          title: "Workshop de Desenvolvimento Web",
          ticketsSold: 78
        },
        {
          id: "q1w2e3r4-t5y6-7u8i-9o0p-1a2s3d4f5g6h",
          title: "Seminário de Marketing Digital",
          ticketsSold: 65
        }
      ]
    }
  };

  return NextResponse.json({ 
    success: true, 
    data: mockDashboardData,
    message: 'Dashboard data retrieved successfully'
  });
}
