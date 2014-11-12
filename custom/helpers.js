function findIndexByKeyValue(obj, key, value)
{
    for (var i = 0; i < obj.length; i++) {
        if (obj[i][key] == value) {
            return i;
        }
    }
    return null;
}
