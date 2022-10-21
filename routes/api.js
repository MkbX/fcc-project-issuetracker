'use strict';

module.exports = function (app) {

  let allArrays = {};

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      console.log('GET - projectName: ', project, '\n');
      console.log('GET - projectContent: ', allArrays[project], '\n');
      //res.json(allArrays[project]);
      let filteredArray = allArrays[project];
      //console.log('before filter', filteredArray);
      console.log('query: ', req.query);
      if(/*filteredArray &&*/ Object.keys(req.query).length > 0) {
        console.log('queryIfEntered ');
        for(const key in req.query) {
          console.log(key, ' ', req.query[key]);
          //console.log('arrayvaut', filteredArray);
          //console.log('arraykey', filteredArray[0][key]);
          //console.log('querykey', req.query[key]);
          //console.log('comp', filteredArray[0][key] == req.query[key]);
          filteredArray = filteredArray.filter(elem => elem[key].toString() == req.query[key]);
          
        }
        //console.log('filtered', filteredArray);
        console.log('filteredGetResponse: ', filteredArray);
        res.json(filteredArray);
      } else {
        console.log('req.query is empty', req.query);
        console.log('getResponse: ', allArrays[project]);
        res.json(allArrays[project]);
      }
      
     
      
    })
    
    .post(function (req, res){
      let project = req.params.project;
      console.log('POST - projectName: ', project);

      if(!req.body.issue_title ||
         !req.body.issue_text ||
         !req.body.created_by) {
          res.json({ error: 'required field(s) missing' });
         } else {
          if(!allArrays[project]) {
            allArrays[project] = [];
            let createdObject = { 
              _id: (Date.now()+1).toString(), 
              issue_title: req.body.issue_title || '', 
              issue_text: req.body.issue_text || '', 
              created_by: req.body.created_by || '', 
              assigned_to: req.body.assigned_to || '', 
              status_text: req.body.status_text || '', 
              open: true, 
              created_on: new Date(), 
              updated_on: new Date() };
            allArrays[project].push(createdObject);
            console.log('NewPostCreation: ', createdObject);
            res.json(createdObject);
            
          } else {       
            let createdObject =  { 
              _id: (Date.now()+1).toString(), 
              issue_title: req.body.issue_title || '', 
              issue_text: req.body.issue_text || '', 
              created_by: req.body.created_by || '', 
              assigned_to: req.body.assigned_to || '', 
              status_text: req.body.status_text || '', 
              open: true, 
              created_on: new Date(), 
              updated_on: new Date() };     
            allArrays[project].push(createdObject);
            console.log('PostCreation: ', createdObject);
            res.json(createdObject);
          }
          

         }
      
    })
    
    .put(function (req, res){
      let project = req.params.project;
      if(!req.body._id) {
        res.json({ error: 'missing _id' });
      } else if(!req.body.issue_title &&
                !req.body.issue_text &&
                !req.body.created_by &&
                !req.body.assigned_to &&
                !req.body.status_text ) {
        res.json({ error: 'no update field(s) sent', '_id': req.body._id });

      } else {
        try {
          //let idToUpdate = allArrays.project.filter(e => e[_id] == req.body._id)[0]._id;
          //console.log(idToUpdate);
          if(!allArrays[project].find(e => e["_id"] == req.body._id)) {
            console.log('id not found');
            res.json({ error: 'could not update', '_id': req.body._id });
          } else {
            if(req.body.issue_title) {            
              allArrays[project].filter(e => e["_id"] == req.body._id)[0].issue_title = req.body.issue_title;
              allArrays[project].filter(e => e["_id"] == req.body._id)[0].updated_on = new Date();
              console.log('updated');
            }
            if(req.body.issue_text) {            
              allArrays[project].filter(e => e["_id"] == req.body._id)[0].issue_text = req.body.issue_text;
              allArrays[project].filter(e => e["_id"] == req.body._id)[0].updated_on = new Date();
              console.log('updated');
            }
            if(req.body.created_by) {            
              allArrays[project].filter(e => e["_id"] == req.body._id)[0].created_by = req.body.created_by;
              allArrays[project].filter(e => e["_id"] == req.body._id)[0].updated_on = new Date();
              console.log('updated');
            }
            if(req.body.assigned_to) {            
              allArrays[project].filter(e => e["_id"] == req.body._id)[0].assigned_to = req.body.assigned_to;
              allArrays[project].filter(e => e["_id"] == req.body._id)[0].updated_on = new Date();
              console.log('updated');
            }
            if(req.body.status_text) {            
              allArrays[project].filter(e => e["_id"] == req.body._id)[0].status_text = req.body.status_text;
              allArrays[project].filter(e => e["_id"] == req.body._id)[0].updated_on = new Date();
              console.log('updated');
            }  
            if(req.body.open) {            
              allArrays[project].filter(e => e["_id"] == req.body._id)[0].open = req.body.open == "false" ? false : true;
              allArrays[project].filter(e => e["_id"] == req.body._id)[0].updated_on = new Date();
              console.log('updated');
            } 
            res.json({  result: 'successfully updated', '_id': req.body._id });
          }
          
        } catch(error) {
          console.log('putError: ', error);
          res.json({ error: 'could not update', '_id': req.body._id });
        }
      }
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      if(!req.body._id) {
        res.json({ error: 'missing _id' });
      } else {
        try {
          let isValidId = allArrays[project].filter(e => e["_id"] == req.body._id)[0]._id;
          console.log(isValidId);
          allArrays[project] = allArrays[project].filter(e => e["_id"] != req.body._id);
          res.json({ result: 'successfully deleted', '_id': req.body._id });
        } catch (error) {
          console.log('deleteError: ', error);
          res.json({ error: 'could not delete', '_id': req.body._id });

        }
      }
      
    });
    
};
