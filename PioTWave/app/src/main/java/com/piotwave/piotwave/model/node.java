package com.piotwave.piotwave.model;

public class node {

    private int id;
    private String manufacturer;
    private String genre;
    private String manufacturerid;
    private String product;
    private String producttype;
    private String type;
    private String name;
    private String loc;
    private boolean ready;
    private boolean withRange;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getManufacturerid() {
        return manufacturerid;
    }

    public void setManufacturerid(String manufacturerid) {
        this.manufacturerid = manufacturerid;
    }

    public String getProduct() {
        return product;
    }

    public void setProduct(String product) {
        this.product = product;
    }

    public String getProducttype() {
        return producttype;
    }

    public void setProducttype(String producttype) {
        this.producttype = producttype;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLoc() {
        return loc;
    }

    public void setLoc(String loc) {
        this.loc = loc;
    }

    public boolean isReady() {
        return ready;
    }

    public void setReady(boolean ready) {
        this.ready = ready;
    }

    public boolean isWithRange() {
        return withRange;
    }

    public void setWithRange(boolean withRange) {
        this.withRange = withRange;
    }
}
