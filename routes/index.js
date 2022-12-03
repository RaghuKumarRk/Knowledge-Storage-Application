/**
 * Created by AyushK on 18/09/20.
 */
import * as ValidationManger from "../middleware/validation";
import KnowledgeModule from "../app/modules/knowledge";
import {stringConstants} from "../app/common/constants";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../config/swagger.json';
const path = require('path');


module.exports = (app) => {

    app.get('/', (req, res) => res.send(stringConstants.SERVICE_STATUS_HTML));
    /**
     * create swagger UI
    */
    //  app.use('/swagger-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    
    /*
     * Knowledge API's
    */
    // API for first time user-sign up will only take username email and password.
    app.post("/knowledge/add", new KnowledgeModule().addKnowledge );

    // API for first time Creating profile and updating user details both.
    app.put("/knowledge/update", new KnowledgeModule().updateKnowledge );

    // API to get user details upon successful login.
    app.get("/knowledge/details", new KnowledgeModule().getKnowledgeDetails )

    // API to get users list
    app.post("/knowledge/list", new KnowledgeModule().getKnowledgeList )

    // API to get search Knowledge by Topic Name
    app.post("/knowledge/search-by-topic", new KnowledgeModule().searchByTopicName);

    /*
     * Todo API's
    */
    // API for first time user-sign up will only take username email and password.
    app.post("/todo/add", new KnowledgeModule().addKnowledge );

    // API for first time Creating profile and updating user details both.
    app.put("/todo/update", new KnowledgeModule().updateKnowledge );

    // API to get user details upon successful login.
    app.get("/todo/details", new KnowledgeModule().getKnowledgeDetails )

    // API to get users list
    app.post("/todo/list", new KnowledgeModule().getKnowledgeList )

    // API to get search Knowledge by Topic Name
    app.post("/todo/search-by-topic", new KnowledgeModule().searchByTopicName);

};
