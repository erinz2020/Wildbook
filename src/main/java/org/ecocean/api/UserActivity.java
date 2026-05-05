package org.ecocean.api;

import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletException;

import org.ecocean.servlet.ServletUtilities;
import org.ecocean.shepherd.core.Shepherd;
import org.ecocean.User;
import org.ecocean.Encounter;
import org.json.JSONObject;

public class UserActivity extends ApiBase {
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {

        String context = ServletUtilities.getContext(request);
        Shepherd myShepherd = new Shepherd(context);

        myShepherd.setAction("api.UserActivity");
        myShepherd.beginDBTransaction();

        try{
            JSONObject home = new JSONObject();
            User currentUser = myShepherd.getUser(request);
            if(currentUser == null) {
                response.setStatus(401);
                response.setHeader("Content-Type", "application/json");
                response.getWriter().write("{\"success\": false}");
                return;
            }
            
            home.put("username", currentUser.infoJSONObject(myShepherd, true, false));

            String dayParam = request.getParameter("days");
            int days = 30;
            if(dayParam != null) {
                days = Integer.parseInt(dayParam);

            }
            long nDaysAgoMillis = System.currentTimeMillis() - ((long) days * 24 * 60 * 60 * 1000);
            int encounterCount = 0;
            for(Encounter enc : myShepherd.getEncountersForSubmitter(currentUser)) {
                if(enc.getDateInMilliseconds() != null && enc.getDateInMilliseconds() >= nDaysAgoMillis) {
                    encounterCount++;
                }
            } 

            String encounterCountInNDays = "encounterCountIn" + days + "Days";
            
            home.put(encounterCountInNDays, encounterCount);

            response.setStatus(200);
            response.setCharacterEncoding("UTF-8");
            response.setHeader("content-type", "application/json");
            response.getWriter().write(home.toString());           
        }catch(Exception e) {
            e.printStackTrace();
        }finally{
            myShepherd.rollbackDBTransaction();
            myShepherd.closeDBTransaction();
        }
   }
}