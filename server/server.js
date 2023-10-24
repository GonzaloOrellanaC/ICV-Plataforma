import express from "express"
import path from "path"
//import fileUpload from "express-fileupload"
import { environment } from "./src/config"
import { Socket } from "./src/controller"
import { databaseLoader, expressLoader } from "./src/loaders"
import { AccessControlServices } from "./src/services"
/* import reportsService from "./src/services/reports.service" */
import * as Sentry from "@sentry/node"
// or use es6 import statements
// import * as Sentry from '@sentry/node';

// or use es6 import statements
// import * as Tracing from '@sentry/tracing';

Sentry.init({
  dsn: environment.sentry.dns,
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

const transaction = Sentry.startTransaction({
  op: "test",
  name: "My First Test Transaction",
});

/* setTimeout(() => {
  try {
    foo();
  } catch (e) {
    Sentry.captureException(e);
  } finally {
    transaction.finish();
  }
}, 99); */


const startServer = async () => {
    /* Conexión a MongoDB  */
    await databaseLoader()

    /* Carga de recursos servidor */
    const app = await expressLoader()

    /* Conexión a control de acceso a servidor */
    await AccessControlServices.initAccessControl()

    /* Inicio de Servidor */
    if (app) {
        console.log("Ok APP")
    }

    //reportsService.getAllReports()

    /* Solo se ejecuta en producción */
    console.info("The server is in production mode")
    app.use(express.static(path.resolve(__dirname, "../client/build")))
    app.use(/* '/assets',  */express.static(__dirname+'/assets'))

    app.get("/*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../client/build", "index.html"))
    })
    const server = app.listen(environment.port, '0.0.0.0', (err) => {
        if (err) {
            console.error("Express startup error: ", err)
            throw err
        }
    })
    Socket(server)
}

startServer()
