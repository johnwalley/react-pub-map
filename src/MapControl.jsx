import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Control, DomEvent, DomUtil } from "leaflet";
import { useMap } from "react-leaflet";

// Renders children inside a Leaflet control so they sit in the map's corners
const MapControl = ({ position, children }) => {
  const map = useMap();
  const [container, setContainer] = useState(null);

  useEffect(() => {
    const control = new Control({ position });

    control.onAdd = () => {
      const div = DomUtil.create("div");
      DomEvent.disableClickPropagation(div);
      return div;
    };

    control.addTo(map);
    setContainer(control.getContainer());

    return () => control.remove();
  }, [map, position]);

  return container ? createPortal(children, container) : null;
};

export default MapControl;
