import {
  ALL_DEPTH_SIZE_PAIRS,
  ValidDepthSizePair,
} from "@solana/spl-account-compression"

const allDepthSizes = ALL_DEPTH_SIZE_PAIRS.flatMap(
  (pair) => pair.maxDepth
).filter((item, pos, self) => self.indexOf(item) == pos)

const defaultDepthPair: ValidDepthSizePair = {
  maxDepth: 3,
  maxBufferSize: 8,
}

export const calculateClosestTreeDepth = (size: number) => {
  let maxDepth: number = defaultDepthPair.maxDepth

  if (!size || size <= 0) {
    return {
      sizePair: defaultDepthPair,
      canopyDepth: maxDepth - 3 >= 0 ? maxDepth - 3 : 0,
    }
  }

  for (let i = 0; i <= allDepthSizes.length; i++) {
    if (Math.pow(2, allDepthSizes[i]) >= size) {
      maxDepth = allDepthSizes[i]
      break
    }
  }

  const maxBufferSize =
    ALL_DEPTH_SIZE_PAIRS.filter((pair) => pair.maxDepth == maxDepth)?.[0]
      ?.maxBufferSize ?? defaultDepthPair.maxBufferSize

  const maxCanopyDepth = maxDepth >= 20 ? 17 : maxDepth

  return {
    sizePair: {
      maxDepth: maxDepth,
      maxBufferSize,
    } as ValidDepthSizePair,
    canopyDepth: maxCanopyDepth - 3 >= 0 ? maxCanopyDepth - 3 : 0,
  }
}
