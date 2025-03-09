"use client";

import { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import Point from "ol/geom/Point";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { Style, Icon } from "ol/style";
import "ol/ol.css";

interface Property {
  _id: string;
  latitude: number;
  longitude: number;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  image: string;
  address: string;
}

interface MapViewProps {
  properties: Property[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (property: Property) => void;
}

export default function MapView({
  properties,
  center = [-0.118092, 51.509865], // Default to London
  zoom = 12,
  onMarkerClick,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Create map instance
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat(center),
        zoom: zoom,
      }),
    });

    // Add markers for all properties
    const features = properties.map((property) => {
      const feature = new Feature({
        geometry: new Point(
          fromLonLat([property.longitude, property.latitude])
        ),
        properties: property, // Store property data in the feature
      });

      return feature;
    });

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: features,
      }),
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: "/marker.png", // You'll need to add this image to your public folder
        }),
      }),
    });

    map.addLayer(vectorLayer);

    // Add click handler for markers
    if (onMarkerClick) {
      map.on("click", (event) => {
        map.forEachFeatureAtPixel(event.pixel, (feature) => {
          const propertyData = (feature as Feature).get("properties");
          if (propertyData) {
            onMarkerClick(propertyData);
          }
        });
      });
    }

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
        mapInstanceRef.current = null;
      }
    };
  }, [properties, center, zoom, onMarkerClick]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[600px] rounded-lg shadow-md"
      style={{ backgroundColor: "#f0f0f0" }}
    />
  );
}
