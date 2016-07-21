package com.piotwave.piotwave;

import android.content.Intent;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AlertDialog;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.app.ActionBar;
import android.support.v4.app.NavUtils;
import android.view.MenuItem;

import com.piotwave.piotwave.deviceListData.deviceContent;

import static android.content.Intent.getIntent;

/**
 * An activity representing a single listDevice detail screen. This
 * activity is only used narrow width devices. On tablet-size devices,
 * item details are presented side-by-side with a list of items
 * in a {@link listDeviceListActivity}.
 */
public class listDeviceDetailActivity extends AppCompatActivity {

    void showDialog()
    {
        String message;
        deviceContent.deviceItem mItem;

        mItem = deviceContent.ITEM_MAP.get(getIntent().getStringExtra(listDeviceDetailFragment.ARG_ITEM_ID));

        // 1. Instantiate an AlertDialog.Builder with its constructor
        AlertDialog.Builder builder = new AlertDialog.Builder(this);

        if(mItem.type == deviceContent.WS_TYPE_LIGHT)
        {
            if(mItem.status > 0) {
                message = "Desligando";
                deviceContent.sendCommand(mItem.serverId, deviceContent.SERVER_STATUS_REQUEST, "false");
            } else {
                message = "Ligando";
                deviceContent.sendCommand(mItem.serverId, deviceContent.SERVER_STATUS_REQUEST, "true");
            }
        }
        else
        {
            if(mItem.status > 0){
                message = "Desligando";
                deviceContent.sendCommand(mItem.serverId, deviceContent.SERVER_STATUS_VALUE, "0");
            } else {
                message = "Ligando";
                deviceContent.sendCommand(mItem.serverId, deviceContent.SERVER_STATUS_VALUE, "99");
            }
        }

        // 2. Chain together various setter methods to set the dialog characteristics
        builder.setMessage(message).setTitle(mItem.content);

        // 3. Get the AlertDialog from create()
        AlertDialog dialog = builder.create();

        dialog.show();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_listdevice_detail);
        Toolbar toolbar = (Toolbar) findViewById(R.id.detail_toolbar);
        setSupportActionBar(toolbar);

        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                showDialog();
            }
        });

        // Show the Up button in the action bar.
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
        }

        // savedInstanceState is non-null when there is fragment state
        // saved from previous configurations of this activity
        // (e.g. when rotating the screen from portrait to landscape).
        // In this case, the fragment will automatically be re-added
        // to its container so we don't need to manually add it.
        // For more information, see the Fragments API guide at:
        //
        // http://developer.android.com/guide/components/fragments.html
        //
        if (savedInstanceState == null) {
            // Create the detail fragment and add it to the activity
            // using a fragment transaction.
            Bundle arguments = new Bundle();
            arguments.putString(listDeviceDetailFragment.ARG_ITEM_ID,
                    getIntent().getStringExtra(listDeviceDetailFragment.ARG_ITEM_ID));
            listDeviceDetailFragment fragment = new listDeviceDetailFragment();
            fragment.setArguments(arguments);
            getSupportFragmentManager().beginTransaction()
                    .add(R.id.listdevice_detail_container, fragment)
                    .commit();
        }
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();
        if (id == android.R.id.home) {
            // This ID represents the Home or Up button. In the case of this
            // activity, the Up button is shown. Use NavUtils to allow users
            // to navigate up one level in the application structure. For
            // more details, see the Navigation pattern on Android Design:
            //
            // http://developer.android.com/design/patterns/navigation.html#up-vs-back
            //
            NavUtils.navigateUpTo(this, new Intent(this, listDeviceListActivity.class));
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}
