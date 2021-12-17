import express from "express";
import path from "path";
import { ApiIcv } from "./src/api-icv";

import { environment } from "./src/config";
import { databaseLoader, expressLoader, apiIcvLoader } from "./src/loaders";
import { AccessControlServices } from "./src/services";

const startServer = async () => {
    /* Conexión a MongoDB  */

    await databaseLoader();

    /* Carga de recursos servidor */
    const app = await expressLoader();

    /* Carga de recursos desde API ICV */
    await apiIcvLoader();

    /* Conexión a control de acceso a servidor */
    await AccessControlServices.initAccessControl();

    /* Inicio de Servidor */
    if (app) {
        console.log("Ok APP");
    }

    /* Solo se ejecuta en producción */
    console.info("The server is in production mode");
    app.use(express.static(path.resolve(__dirname, "../client/build")));

    app.get("/*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
    });

    app.listen(environment.port, (err) => {
        if (err) {
            console.error("Express startup error: ", err);
            throw err;
        }

        console.info(`Express server started in port: ${environment.port}`);
    });
};

startServer();
