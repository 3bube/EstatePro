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
import { Style, Icon, Circle, Fill, Stroke } from "ol/style";
import "ol/ol.css";

interface PropertyMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
}

export default function PropertyMap({
  latitude,
  longitude,
  zoom = 15,
}: PropertyMapProps) {
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
        center: fromLonLat([longitude, latitude]),
        zoom: zoom,
      }),
    });

    // Add marker for the property
    const markerFeature = new Feature({
      geometry: new Point(fromLonLat([longitude, latitude])),
    });

    // Create a custom marker style
    const markerStyle = new Style({
      image: new Circle({
        radius: 8,
        fill: new Fill({
          color: '#E74C3C'
        }),
        stroke: new Stroke({
          color: '#ffffff',
          width: 2
        })
      })
    });

    // Add a pulsing effect marker
    const pulsingStyle = new Style({
      image: new Circle({
        radius: 15,
        fill: new Fill({
          color: 'rgba(231, 76, 60, 0.2)'
        }),
        stroke: new Stroke({
          color: 'rgba(231, 76, 60, 0.4)',
          width: 1
        })
      })
    });

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [markerFeature],
      }),
      style: [pulsingStyle, markerStyle], // Apply both styles
    });

    map.addLayer(vectorLayer);
    mapInstanceRef.current = map;

    // Center the map with animation
    map.getView().animate({
      center: fromLonLat([longitude, latitude]),
      duration: 1000
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
        mapInstanceRef.current = null;
      }
    };
  }, [longitude, latitude, zoom]);

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">Location</h2>
      <div
        ref={mapRef}
        className="w-full h-[400px] rounded-lg shadow-md"
        style={{ backgroundColor: "#f0f0f0" }}
      />
    </div>
  );
}
