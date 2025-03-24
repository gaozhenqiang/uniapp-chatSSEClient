// 检索字符，并且加上该字符的长度
const indexOfLen = (str) => {
  const startIndex = str.indexOf(str);

  if (startIndex !== -1) {
    return startIndex + str.length
  }

  return -1;
}

/**
 * 解析SSE数据
 * sse返回的数据可能会有多个消息相连，这里处理字符串，返回数组
 * @param data sse字符串数据
 * @returns {*} 处理过后的数组
 */
export const parseSseData = (data) => {
  try {
    let lines = data.split("\n");

    lines = lines.map(v => {
      if (!v) return null;
      let startInd = -1;

      for (const ind of [indexOfLen("data: "), v.indexOf("{")]) {
        if (ind !== -1) {
          startInd = ind;
          break;
        }
      }

      if (startInd === -1) {
        return v;
      } else {
        return v.substring(startInd, v.length).trim();
      }
    }).filter(Boolean);

    return lines;
  } catch (e) {
    console.warn("解析失败：", e);
    return data;
  }
}