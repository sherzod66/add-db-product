export const checkIsObjectSame = (obj1: any, obj2: any) => {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);

  if (obj1Keys.length !== obj2Keys.length) {
    return false;
  }

  const obj1Values = Object.values(obj1);
  const obj2Values = Object.values(obj2);

  if (obj1Values.length !== obj2Values.length) {
    return false;
  }

  for (let i = 0; i < obj1Keys.length; i++) {
    if (!obj2Keys.find((a) => a === obj1Keys[i])) {
      return false;
    }
    if (!obj2Values.find((a) => a === obj1Values[i])) {
      return false;
    }
  }

  return true;
};
