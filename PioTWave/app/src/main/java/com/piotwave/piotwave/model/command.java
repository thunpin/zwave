package com.piotwave.piotwave.model;

public class command {

    private int class_id;
    private int index;
    private int instance;
    private int type;
    private int genre;
    private int label;
    private int units;
    private int read_only;
    private int write_only;
    private int is_polled;
    private int min;
    private int max;
    private int value;

    public int getClass_id() {
        return class_id;
    }

    public void setClass_id(int class_id) {
        this.class_id = class_id;
    }

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public int getInstance() {
        return instance;
    }

    public void setInstance(int instance) {
        this.instance = instance;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public int getGenre() {
        return genre;
    }

    public void setGenre(int genre) {
        this.genre = genre;
    }

    public int getLabel() {
        return label;
    }

    public void setLabel(int label) {
        this.label = label;
    }

    public int getUnits() {
        return units;
    }

    public void setUnits(int units) {
        this.units = units;
    }

    public int getRead_only() {
        return read_only;
    }

    public void setRead_only(int read_only) {
        this.read_only = read_only;
    }

    public int getWrite_only() {
        return write_only;
    }

    public void setWrite_only(int write_only) {
        this.write_only = write_only;
    }

    public int getIs_polled() {
        return is_polled;
    }

    public void setIs_polled(int is_polled) {
        this.is_polled = is_polled;
    }

    public int getMin() {
        return min;
    }

    public void setMin(int min) {
        this.min = min;
    }

    public int getMax() {
        return max;
    }

    public void setMax(int max) {
        this.max = max;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }
}
