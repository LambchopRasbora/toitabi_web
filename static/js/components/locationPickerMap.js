const LocationPickerMap={

    props:
    {
        lat:{type:Number,default: 34.981},
        lng:{type:Number,default: 135.758},
        zoom:{type:Number,default: 13},
        width:{type:String,default: '100%'},
        height:{type:String,default: '400px'},
        iconUri:{type:String,default: ''}
    },
    template:`
    <div class="map-container" ref="mapElement" :style="{ width: width, height: height }"></div>
    `,
    data(){
        return{
            map: null,
            registerdPoint:null,
            icon:null,
            marker:null
        };
    },
    
    methods:{
        getRegiterdPoints(){
            console.log(this.registerdPoint);
            return this.registerdPoint;
        },
        initMap(){
            this.map = L.map(this.$refs.mapElement).setView([this.lat, this.lng], this.zoom);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(this.map);
            this.map.on('click',this.onMapClick);
            if(iconUri)
            {
                this.icon=L.icon({
                    iconUri:this.iconUri,
                    iconSize: [40, 40],
                    iconAnchor: [20, 40]
                });
            }

        },
        onMapClick(e){
            const latlng=e.latlng;
            
            const data={
                name:'登録データ',
                latlng:latlng
            };
            this.onPointRegistered(data);
            
        },
        onPointRegistered(data){
            console.log('登録データ:',data);
            this.registerdPoint={
                lat:data.latlng.lat,
                lng:data.latlng.lng
            };
            if(this.marker)
            {
                this.marker.setLatLng([this.registerdPoint.lat,this.registerdPoint.lng]);
            }
            else{
                if(icon)
                {
                    this.marker = L.marker(data.latlng,{icon:this.icon}).addTo(this.map);
                }
                else{
                    this.marker = L.marker(data.latlng).addTo(this.map);
                }
            }
            
        },
        RegisterPoint(lat,lng)
        {
            this.onPointRegistered({latlng:{lat:lat,lng:lng}});
        },
        beforeUnmount(){

        }
    },mounted(){
        this.initMap();
    }

};

export default LocationPickerMap;