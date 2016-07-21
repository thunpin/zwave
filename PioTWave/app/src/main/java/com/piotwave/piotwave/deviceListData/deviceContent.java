package com.piotwave.piotwave.deviceListData;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.piotwave.piotwave.util.httpManager;

import org.json.JSONArray;
import org.json.JSONObject;

public class deviceContent {

    public static final List<deviceItem> ITEMS = new ArrayList<deviceItem>();
    public static final Map<String, deviceItem> ITEM_MAP = new HashMap<String, deviceItem>();
    public static final String SERVER_STATUS_REQUEST = "37";
    public static final String SERVER_STATUS_VALUE = "38";

    private static String WS_NODES_URL = "/nodes";
    private static String WS_STATUS_URL = "/status/";
    private static String WS_NODE_URL = "/node/";
    private static String WS_COMMAND_URL = "/command/";

    public static int WS_TYPE_LIGHT = 1;
    public static int WS_TYPE_DIMMER = 2;

    static {
        addItem(createItem(1, ""));
        addItem(createItem(2, ""));
        updateDetails();
    }

    private static void addItem(deviceItem item) {
        ITEMS.add(item);
        ITEM_MAP.put(item.id, item);
    }

    private static deviceItem createItem(int position, String name) {
        return new deviceItem(String.valueOf(position), name, "");
    }

    public static void updateDetails() {
        httpManager httpMan = new httpManager();

        JSONArray nodesArray = httpMan.requestWebServiceArray(WS_NODES_URL);

        if(nodesArray != null) {
            try {
                for (int i = 0; i < nodesArray.length(); i++) {
                    JSONObject jsonobject = nodesArray.getJSONObject(i);
                    ITEMS.get(i).serverId = "" + jsonobject.getInt("id");
                    ITEMS.get(i).content = jsonobject.getString("name");
                    ITEMS.get(i).productType = jsonobject.getString("producttype");
                    ITEMS.get(i).details =
                            "Nome: " + jsonobject.getString("name") +  "\n" +
                            "Produzido por: " + jsonobject.getString("manufacturer") +  "\n" +
                            "ProductType = " + jsonobject.getString("producttype") + "\n";
                    // Horrible code ... inserted here just to make it work .. TODO: identify the component class
                    if(ITEMS.get(i).serverId.equals("2")) {
                        ITEMS.get(i).type = WS_TYPE_LIGHT;
                    } else if(ITEMS.get(i).serverId.equals("3")) {
                        ITEMS.get(i).type = WS_TYPE_DIMMER;
                    }
                }
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }
    }

    public static String getStatus(String nodeId, String command) {
        httpManager httpMan = new httpManager();

        String url = WS_NODE_URL + nodeId + WS_STATUS_URL + command;
        JSONArray nodesArray = httpMan.requestWebServiceArray(url);

        if(nodesArray != null) {
            try {
                for (int i = 0; i < nodesArray.length(); i++) {
                    JSONObject jsonobject = nodesArray.getJSONObject(i);
                    return jsonobject.getString("value");
                }
            } catch (Exception e) {
                System.out.println(e.getMessage());
            }
        }
        return "";
    }

    public static void sendCommand(String nodeId, String command, String value) {
        httpManager httpMan = new httpManager();

        // "0/1/" Sets the instance
        String url = WS_NODE_URL + nodeId + WS_COMMAND_URL + command + "0/1/" + value;
        httpMan.requestGet(url);
    }

    public static class deviceItem {
        public String id;
        public String serverId;
        public String content;
        public String details;
        public String productType;
        public int type;
        public int status;
        public String name;

        public deviceItem(String id, String content, String details) {
            this.id = id;
            this.content = content;
            this.details = details;
        }

        @Override
        public String toString() {
            return content;
        }
    }
}
