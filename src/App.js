import React from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import { formatRelative } from "date-fns";

import "@reach/combobox/styles.css";
import mapStyles from "./mapStyles";

const libraries = ["places"];
const mapContainerStyle = {
  height: "100vh",
  width: "100vw",
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};
const center = {
  lat: -22.578786,
  lng: -47.4845106,
};

export default function App() {

//  let state = {
//     region: {
//       latitude: 37.78825,
//       longitude: -122.4324,
//       latitudeDelta: 0.0922,
//       longitudeDelta: 0.0421,
//     }
// }



  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [markers, setMarkers] = React.useState([]);
  const [selected, setSelected] = React.useState(null);

  const onMapClick = React.useCallback((e) => {

  setMarkers((current) => [
     // ...current,
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
        time: new Date(),
      },
    ]);
  }, []);

  const onMarkerDragEnd = React.useCallback((e) => {

    setMarkers((current) => [
       // ...current,
        {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
          time: new Date(),
        },
      ]);
    }, []);


//  const onMarkerDragEnd = (coord) => {
//     let newRegion = {
//       latitude: parseFloat(coord.lat),
//       longitude: parseFloat(coord.lng),
//       latitudeDelta: 0.0522,
//       longitudeDelta: 0.0321,
//     };
//     setMarkers({
//       locale: newRegion,
//     });
//   };

  // const onMarkerEnd = React.useCallback((e) => {
  //   console.log("marker", e);  

  // setMarkers((current) => [
  //     ...current,
  //     {
  //       lat: e.latLng.lat(),
  //       lng: e.latLng.lng(),
  //       time: new Date(),
  //     },
  //   ]);
  // }, []);


  const mapRef = React.useRef();

  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(18);
  }, []);


  

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <div>
      <h1>
        Den??ncia Ambiental{" "}
        <span role="img" aria-label="tent">
        ????
        </span>
      </h1>

      <Locate panTo={panTo} />
      <Search panTo={panTo} />

      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={11}
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
 
      >
        {markers.map((marker) => (          
          <Marker
            draggable={true}
            onDragEnd={(e) => {console.log(e); onMarkerDragEnd(e)}}
            key={`${marker.lat}-${marker.lng}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => {
              console.log("marker", marker);
              setSelected(marker);
            }}
            // onPositionChanged={() => {  
            //   let lat = marker.lat;
            //   let lng = marker.lng;       
            //   panTo({ lat, lng });
            // }}
            icon={{
              url: `/denuncia_.svg`,
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
              scaledSize: new window.google.maps.Size(30, 30),
            }}
          />
        ))}

        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
            }}
            onPositionChanged={{ lat: selected.lat, lng: selected.lng }}
          >
            <div>
              <h2>
                <span role="img" aria-label="Denuncia">
                ????????
                </span>{" "}
                Informa????es:
              </h2>
              <p>Identifica????o {formatRelative(selected.time, new Date())}</p>
              <form >

<br/>
<label htmlFor="name">Descri????o</label>
<textarea  className="input" type="textarea" id="descricao" name="descricao" placeholder="Descreva em poucas palavras a ocorr??ncia" />
<br/>  


<label htmlFor="labelproblema">Selecione um Item para Den??ncia</label>
<br/>

<select defaultValue="0"> 
        <option value="0" disabled>Escolha uma op????o ...</option>
  
<option value="1">Desmatamento/Extra????o Irregular</option>
<option value="2">Ca??a/Com??rcio Ilegal de animais</option>
<option  value="3">Fuma??a/Fuligem/Poeira/Odor - Irregular</option>
<option value="4">Descarte de res??duos na ??gua</option>
<option value="5">Descarte de res??duos no solo</option>
<option value="6">Descarte irregular de entulhos/Ca??ambeiros</option>
<option value="7">Ru??do/Vibra????o Industrial</option>
<option value="8">Limpeza de pasto com fogo </option>
<option value="9">Queimada de palha com fogo</option>
<option value="10">Fabrica????o, venda ou soltura de Bal??es</option>
</select>
<br/>            
</form>



            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
}

function Locate({ panTo }) {
  return (
    <button
      className="locate"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        );
      }}
    >
      <img src="/compass.svg" alt="compass" />
    </button>
  );
}

function Search({ panTo }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {      
      location: { lat: () => -22.578786, lng: () => -47.4845106 },
      radius: 50 * 1000,
    },
  });


  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });
    } catch (error) {
      console.log("???? Error: ", error);
    }
  };

  return (
    <div className="search">
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Digite sua localiza????o"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}
