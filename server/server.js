import express from "express";
import path from "path";
//import fileUpload from "express-fileupload";
import { environment } from "./src/config";
import { databaseLoader, expressLoader } from "./src/loaders";
import { AccessControlServices } from "./src/services";

const startServer = async () => {
    /* Conexión a MongoDB  */
    await databaseLoader();

    /* Carga de recursos desde API ICV */
    //await apiIcvLoader();

    /* Carga de recursos servidor */
    const app = await expressLoader();

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
    app.listen(environment.port, '0.0.0.0', (err) => {
        if (err) {
            console.error("Express startup error: ", err);
            throw err;
        }

        console.info(`Express server started in port: ${environment.port}`);
    });
};

startServer();
