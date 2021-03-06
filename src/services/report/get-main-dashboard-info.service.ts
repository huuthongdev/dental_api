import { CalendarDentist, Ticket, ReceiptVoucher, Client } from "../../../src/refs";

export class GetMainDashboardInfoService {
    static async get(branchId: string) {
        // Get ticket today, get ticket not have calendar (This branch)
        const calendarsToday = await this.getCalendarsToday(branchId);
        const ticketNotHaveCanlendar = await this.getTicketNotHaveCalendar(branchId);
        const numberReports = await this.getNumberReports(branchId);
        return {
            calendarsToday,
            ticketNotHaveCanlendar,
            numberReports
        }
    }

    static async getNumberReports(branchId: string) {
        // Tổng doanh thu
        const receiptVouchers = await ReceiptVoucher.find({ branchTransaction: branchId }) as ReceiptVoucher[];
        let totalRevenue: number;
        if (receiptVouchers.length === 0) { totalRevenue = 0; }
        else { totalRevenue = receiptVouchers.map(v => v.totalPayment).reduce((a, b) => a + b); }
        // Tổng khách hàng
        const client = await Client.find({}) as Client[];
        const totalClients = client.length;
        // Tổng hồ sơ điều trị tại chi nhánh này
        const tickets = await Ticket.find({ branchRegister: branchId }) as Ticket[];
        const totalTickets = tickets.length;
        return { totalRevenue, totalClients, totalTickets }
    }

    static async getCalendarsToday(branchId: string) {
        // Get all calendar of all dentist in this branch
        const calendarsAll = await CalendarDentist.find({ branch: branchId })
            .sort({ startTime: 1 })
            .populate({
                path: 'ticket',
                select: 'client status',
                populate: {
                    path: 'client',
                    select: 'sid name'
                }
            })
            .populate('dentist', 'name') as CalendarDentist[];
        // Filter ticket
        const now = new Date().toLocaleDateString('en-GB');
        const calendarsToday = calendarsAll.filter(v => new Date(v.startTime).toLocaleDateString('en-GB') === now);
        return calendarsToday;
    }

    static async getTicketNotHaveCalendar(branchId: string) {
        // Get các hò sơ điều trị mà chưa được tạo lịch hẹn

        // (1) Get hồ sơ đang điều trị tại chi nhánh đó 
        let ticketInThisBranchId = await Ticket.find({ branchRegister: branchId, status: 'WORKING' })
            .select('sid client dentistResponsible status items totalAmount receiptVoucher calendars')
            .populate('client', 'name email phone')
            .populate('dentistResponsible', 'name email phone')
            .populate('items.service', 'name unit')
            .populate('receiptVoucher')
            .populate('calendars', 'startTime endTime status') as Ticket[];
        // (2) Filter hồ sơ chưa có lịch hẹn hoặc có lịch hẹn mà đã quá hạn
        ticketInThisBranchId = ticketInThisBranchId.filter(v => v.calendars.length === 0
            || !v.calendars.find(v => +v.endTime > Date.now())
        );
        return ticketInThisBranchId;
    }
}