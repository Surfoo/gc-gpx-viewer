(function() {

    L.Control.Options = L.Control.extend({
        options: {
            position: 'topleft',
            title: 'Options',
            forceSeparateButton: true
        },

        onAdd: function(map) {
            var className = 'leaflet-control-options',
                container;

            if (map.zoomControl && !this.options.forceSeparateButton) {
                container = map.zoomControl._container;
            } else {
                container = L.DomUtil.create('div', 'leaflet-bar');
            }

            this._createButton(this.options.title, className, container, this.toggleSidebar, map);

            return container;
        },

        _createButton: function(title, className, container, fn, context) {
            var link = L.DomUtil.create('a', className, container);
            link.href = '#';
            link.title = title;

            L.DomEvent
                .addListener(link, 'click', L.DomEvent.stopPropagation)
                .addListener(link, 'click', L.DomEvent.preventDefault)
                .addListener(link, 'click', fn, context);

            return link;
        },

        toggleSidebar: function() {
            sidebar.toggle();
        }
    });

    L.Map.addInitHook(function() {
        if (this.options.optionsControl) {
            this.optionsControl = L.control.options(this.options.fullscreenControlOptions);
            this.addControl(this.optionsControl);
        }
    });

    L.control.options = function(options) {
        return new L.Control.Options(options);
    };

})();
