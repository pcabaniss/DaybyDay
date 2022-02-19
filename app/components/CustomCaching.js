import React, { useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";
import { View, StyleSheet, Alert, Image } from "react-native";

function CustomCaching({ source: { uri }, cacheKey, style }) {
  const [imageUri, setImageUri] = useState("");

  useEffect(() => {
    const loadImage = async () => {
      const imageXt = getImageExt(uri);
      if (!imageXt || !imageXt.length) {
        Alert.alert("Could not load image.");
        return;
      }
      const cachedUri = FileSystem.cacheDirectory + cacheKey + imageXt[0];

      const imageExistInCache = await findImageInCache(cachedUri);

      if (imageExistInCache.exists) {
        console.log("cached!"), setImageUri(cachedUri);
      } else {
        let cached = await cacheImage(uri, cachedUri, () => {});
        if (cached.cached) {
          console.log("Cached New!");
          setImageUri(cached.path);
        } else {
          Alert.alert("Error loading image.");
        }
      }
    };
    loadImage();
  }, []);

  const cacheImage = async (uri, cacheUri, callback) => {
    try {
      const downloadImage = FileSystem.createDownloadResumable(
        uri,
        cacheUri,
        {},
        callback
      );
      const downloaded = await downloadImage.downloadAsync();
      return {
        cached: true,
        error: false,
        path: downloaded.uri,
      };
    } catch (error) {
      return {
        cached: false,
        error: true,
        message: error,
      };
    }
  };

  const findImageInCache = async (uri) => {
    try {
      const info = await FileSystem.getInfoAsync(uri);
      return { ...info, error: false };
    } catch (error) {
      return {
        exists: false,
        error: true,
        message: error,
      };
    }
  };
  const getImageExt = (uri) => {
    var baseName = uri.split(/[\\/]/).pop();
    console.log(baseName);
    return /[.]/.exec(baseName) ? /[^.]+$/.exec(baseName) : undefined;
  };

  return <Image source={{ uri: uri }} style={style} />;
}

const styles = StyleSheet.create({
  container: {},
});

export default CustomCaching;
