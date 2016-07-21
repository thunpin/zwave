package com.piotwave.piotwave;

import android.app.Activity;
import android.support.design.widget.CollapsingToolbarLayout;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.piotwave.piotwave.deviceListData.deviceContent;

/**
 * A fragment representing a single listDevice detail screen.
 * This fragment is either contained in a {@link listDeviceListActivity}
 * in two-pane mode (on tablets) or a {@link listDeviceDetailActivity}
 * on handsets.
 */
public class listDeviceDetailFragment extends Fragment {
    /**
     * The fragment argument representing the item ID that this fragment
     * represents.
     */
    public static final String ARG_ITEM_ID = "item_id";

    /**
     * The dummy content this fragment is presenting.
     */
    private deviceContent.deviceItem mItem;

    /**
     * Mandatory empty constructor for the fragment manager to instantiate the
     * fragment (e.g. upon screen orientation changes).
     */
    public listDeviceDetailFragment() {
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (getArguments().containsKey(ARG_ITEM_ID)) {
            mItem = deviceContent.ITEM_MAP.get(getArguments().getString(ARG_ITEM_ID));

            Activity activity = this.getActivity();
            CollapsingToolbarLayout appBarLayout = (CollapsingToolbarLayout) activity.findViewById(R.id.toolbar_layout);
            if (appBarLayout != null) {
                appBarLayout.setTitle(mItem.content);
            }
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.listdevice_detail, container, false);

        if (mItem != null) {
            String status = deviceContent.getStatus(mItem.serverId, deviceContent.SERVER_STATUS_REQUEST);

            int statusInt = Integer.parseInt(status);

            mItem.status = statusInt;

            if(statusInt > 0)
            {
                ((TextView) rootView.findViewById(R.id.listdevice_detail)).setText(mItem.details + "\nLIGADO");
            }
            else
            {
                ((TextView) rootView.findViewById(R.id.listdevice_detail)).setText(mItem.details + "\nDESLIGADO");
            }
        }
        return rootView;
    }
}
