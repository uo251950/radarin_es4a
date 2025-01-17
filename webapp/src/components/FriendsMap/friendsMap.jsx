import React, { useEffect, useState } from "react";
import GoogleMapReact from 'google-map-react';
import { usePosition } from 'use-position';

import solid from '@solid/query-ldflex';

import { useWebId, List } from  '@solid/react';
import { useLDflexValue, useLDflexList } from '@solid/react';
import axios from 'axios'; 

//import './friendsMap.css'


var veces = 0;

const Marker = (props) => (
  <div style={{
    color: 'white', 
    background: props.color,
    padding: '15px 15px',
    display: 'inline-flex',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    transform: 'translate(-50%, -50%)'
  }}>
    {props.text}
  </div>
);

const Circle = (props) => (
  <div style={{
    color: 'red', 
    background: props.color,
    padding: '15px 15px',
    display: 'inline-flex',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    transform: 'translate(-50%, -50%)'
  }}>
    {props.text}
  </div>
);

const radius = () => {
  if (window.sessionStorage.getItem("radius") != null) {
      return window.sessionStorage.getItem("radius").valueOf();
  }
  else {
      window.sessionStorage.setItem("radius", "5");
  }
  return window.sessionStorage.getItem("radius").valueOf();
};

console.log(radius());

async function getUserWebID () {
  const user = solid.data.user;
  const webID = await user;
  return webID;
}

async function getFriends( friends ) {
  const friendsValue = await friends;
  return friendsValue;
}




// Use React.Memo
function FriendsMap( props ) {
  const [userFriendsList, setUserFriendsList] = useState( [] );
  const [serverResponse, setServerResponse] = useState( {} );
  const [userWebID, setUserWebID] = useState( useWebId() );
  const [lista, setLista] = useState( {} );

  const tempFriendsList = [];
  const webID = useWebId();

  const { latitude, longitude } = usePosition( false );

  getFriends(useLDflexList( "[" + webID + "].friends" ))
        .then( (friendsList) => { setUserFriendsList( friendsList ) });


    //Metemos esto en una función para que no se ejecute todo el rato
    function prueba(){
      userFriendsList.forEach(element => tempFriendsList.push( element.valueOf() ) );

      let userInfo = { 
        "webid": webID,
        "data": {
          "friends": tempFriendsList, 
          "last_location": {
            "lat": latitude, 
            "lon": longitude, 
            "timestamp": Date.now() 
          }
        }
      }
    
      if (tempFriendsList.length > 0 ){
        const apiEndPoint = process.env.REACT_APP_API_URI || "http://localhost:5000/api";
        axios.post( apiEndPoint + '/users/update', userInfo )
            .then(res => { setLista(res.data) }); //Usamos el setState y metemos la lista que luego usaremos con setList
      }
    }

    // TODO: Fix
    if ( veces < 1000 ) { prueba(); veces++; }

  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <GoogleMapReact
      bootstrapURLKeys={{ key: "AIzaSyCoW1RuwmBwVJTgNm9u3ruBf_oMJGnLckY" }}
      center={{lat: latitude, lng: longitude}}
      defaultZoom={15}
      yesIWantToUseGoogleMapApiInternals={true}
      onGoogleApiLoaded={({map, maps}) =>
      {
        new maps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.3,
          map,
          center: {lat: latitude, lng: longitude},
          radius: radius()*1000,
        });
      }}
        >
       <Marker lat={ latitude } lng={ longitude } color="blue" text="Tú"/>

       { Object.keys(lista).map( (amigo) => {
          return (
            <Marker lat={ lista[amigo].lat } lng={ lista[amigo].lon } color="green" text={ amigo.split("/")[2].split(".")[0] } />
          );
       })}
      
       
    </GoogleMapReact> 
    </div>
  );
}

export default FriendsMap;