package org.ecocean.api;

import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletException;

import org.json.JSONObject;

import org.ecocean.servlet.ServletUtilities;
import org.ecocean.shepherd.core.Shepherd;
import org.ecocean.User;

public class UserProfile extends ApiBase {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {

        String context = ServletUtilities.getContext(request);
        Shepherd myShepherd = new Shepherd(context);

        myShepherd.setAction("api.userProfile");
        myShepherd.beginDBTransaction();

        try{
            User currentUser = myShepherd.getUser(request);
            if(currentUser == null){
                response.setStatus(401);
                response.setHeader("content-type", "application/json");
                response.getWriter().write("{\"success\":false}");
                return;
            }

        JSONObject body = ServletUtilities.jsonFromHttpServletRequest(request);

        String fullName = body.optString("fullName", null);
        String affiliation = body.optString("affiliation", null);
        String userStatement = body.optString("userStatement", null);

        if(fullName == null && affiliation == null && userStatement == null) {
            response.setStatus(400);
            response.setHeader("content-type", "application/json");
            JSONObject result = new JSONObject();
            result.put("success", false);
            result.put("error", "No valid fields provided");
            response.getWriter().write(result.toString());
            return;
        }

        if(fullName != null){
            if(fullName.trim().isEmpty()){
                response.setStatus(400);
                response.setHeader("content-type", "application/json");
                JSONObject result = new JSONObject();
                result.put("success", false);
                result.put("error", "fullname is empty");
                response.getWriter().write(result.toString());
                return;
            }
        }

        if(affiliation != null){   
            if(affiliation.trim().isEmpty()){
                response.setStatus(400);
                response.setHeader("content-type", "application/json");
                JSONObject result = new JSONObject();
                result.put("success", false);
                result.put("error", "affiliation is empty");
                response.getWriter().write(result.toString());
                return;
            }
        }

        if(userStatement != null){   
            if(userStatement.trim().isEmpty()){
                response.setStatus(400);
                response.setHeader("content-type", "application/json");
                JSONObject result = new JSONObject();
                result.put("success", false);
                result.put("error", "userStatement is empty");
                response.getWriter().write(result.toString());
                return;
            }
        }

        if(fullName != null){
            currentUser.setFullName(fullName);
        }
        if(affiliation != null){
            currentUser.setAffiliation(affiliation);
        }
        if(userStatement != null){
            currentUser.setUserStatement(userStatement);
        }

        myShepherd.commitDBTransaction();
        response.setStatus(200);
        response.setCharacterEncoding("UTF-8");
        response.setHeader("content-type", "application/json");
        JSONObject result = new JSONObject();
        result.put("success", true);
        response.getWriter().write(result.toString());      
        } catch (Exception e){
            e.printStackTrace();
            response.setStatus(500);
            response.setHeader("content-type", "application/json");
            JSONObject result = new JSONObject();
            result.put("success", false);
            result.put("error", e.getMessage());
            response.getWriter().write(result.toString());
        } finally {
            myShepherd.closeDBTransaction();
        }
    }
}