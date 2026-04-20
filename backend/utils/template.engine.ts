const compileTemplate = (template: string, variables: any) => {
    return template.replace(/{{(.*?)}}/g, (_: any, key: string) => {
        return variables[key.trim()] || "";
    });
};

module.exports = { compileTemplate };