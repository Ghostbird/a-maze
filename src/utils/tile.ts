import axios from 'axios'
import { Observable, forkJoin, from, of, switchMap } from 'rxjs'
import type { Range } from '@/utils/range'
const { floor } = Math

export type TileSet2D = {
  size: number
} & { [K in Range<0, 15>]: ImageBitmap }

export function getBitmapTileSet(uri: string): Observable<TileSet2D> {
  return from(axios.get<Blob>(uri, { responseType: 'blob' })).pipe(
    // Get the tileset image
    switchMap((response) => createImageBitmap(response.data)),
    switchMap((image) => {
      const size = floor(image.width / 4)
      return forkJoin(
        new Array(16).fill(image).reduce(
          (tileSet, img, ix) => ({
            ...tileSet,
            [ix]: createImageBitmap(img, size * floor(ix % 4), size * floor(ix / 4), size, size)
          }),
          { size: of(size) }
        ) as { [K in keyof TileSet2D]: Observable<TileSet2D[K]> }
      )
    })
  )
}
