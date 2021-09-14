# Basic JPEG algorithm

## Steps

1. Color Space Conversion
2. Chroma subsampling
3. Segmentation into Blocks
4. Discrete Cosine Transformation
5. Quantization
6. Zigzag Reorder
7. RLE and Huffman Coding


## Resources

1. https://www.w3.org/Graphics/JPEG/jfif3.pdf 
2. https://link.springer.com/content/pdf/10.1155/2009/485817.pdf 
3. https://github.com/thorfdbg/libjpeg
4. https://habr.com/ru/post/206264 
5. https://www.impulseadventure.com/photo/jpeg-compression.html 


## Execute

```js
node main.js --f ./some.png -c 50
```

```
--f - Path to PNG file
--c - Compress quality [1...100]
```