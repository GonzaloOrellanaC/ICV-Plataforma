import { executionReportsDatabase } from "../indexedDB"

export default async (executionReport, report) => {
    executionReport.updatedAt = new Date(Date.now()).toISOString()
    report.updatedAt = new Date(Date.now()).toISOString()
    let exDb = await executionReportsDatabase.initDb();
    await executionReportsDatabase.actualizar(executionReport, exDb.database);
}