export const checkPrefixes = (arr: string[]) =>{
    let hasJSS = false;
    let hasSSS = false;

    for (const str of arr) {
        if (!str.startsWith('JSS') && !str.startsWith('SSS')) {
            return 'Mixed';
        }
        if (str.startsWith('JSS')) {
            hasJSS = true;
        }
        if (str.startsWith('SSS')) {
            hasSSS = true;
        }
    }

    if (hasJSS && hasSSS) {
        return 'Mixed';
    } else if (hasJSS) {
        return 'JSS';
    } else {
        return 'SSS';
    }
}