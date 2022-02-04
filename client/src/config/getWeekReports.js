import { reportsRoutes } from "../routes"


export default () => {
    let curr = new Date;
    let first = curr.getDate() - curr.getDay() + 1;
    let last = first + 6;

    let firstDay = new Date(curr.setDate(first)).toISOString();
    let lastday = new Date(Date.now()).toISOString();


    return [firstDay, lastday]
    //reportsRoutes.getReportCompletedByWeek()
}