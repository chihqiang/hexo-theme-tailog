hexo.extend.helper.register("conf", cfg => {
    let conf = hexo.theme.config[cfg]
    if (hexo.config[cfg]) {
        conf = hexo.config[cfg]
    }
    return conf
})

hexo.extend.generator.register('tags', function (locals) {
    return {
        path: 'tags.html',
        data: {},
        layout: ['tags', 'layout']
    };
});
