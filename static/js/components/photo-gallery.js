const PhotoGallery={
    props:{
        photos:Array
    },
    data(){
        const defaultNoImage = '/asset/images/default/NoImage.jpg';

        const standardizedPhotos = Array.from({ length: 4 }, (_, i) => {
            return (this.photos && this.photos[i]) ? this.photos[i] : defaultNoImage;
        });

    const firstImgId=0;

        return{
            currentForucusImgId:firstImgId,
            mainImgSrc:standardizedPhotos[firstImgId],
            currentPhotoImgs:standardizedPhotos
        }
    },
    methods:{
        setcurrentForcusImgId(id)
        {
            this.currentForucusImgId=id;
            this.mainImgSrc=this.currentPhotoImgs[this.currentForucusImgId];
        },
        setImg(id,src)
        {
            if(id<0||id>=4)return;
            this.currentPhotoImgs[id]=src;
        },
        getCurrentPhotoImgs()
        {
            return this.currentPhotoImgs;
        }
    },
    template:`
    <section id="gallerySection" class="gallery c-card">
        <!--メイン写真-->
        <div class="main-photo">
          <img id="mainPhoto" :src="mainImgSrc" alt="spot main">
        </div>

        <!--サムネイル一覧-->
        <div class="thumbs" id="thumbs">
          <button class="thumb" :class="{ 'is-active': currentForucusImgId === 0 }" :data-src="currentPhotoImgs[0]">
            <img :src="currentPhotoImgs[0]" @click="setcurrentForcusImgId(0)" alt="">
          </button>
          <button class="thumb" :class="{ 'is-active': currentForucusImgId === 1 }" :data-src="currentPhotoImgs[1]">
            <img :src="currentPhotoImgs[1]" @click="setcurrentForcusImgId(1)" alt="">
          </button>
          <button class="thumb" :class="{ 'is-active': currentForucusImgId === 2 }" :data-src="currentPhotoImgs[2]">
            <img :src="currentPhotoImgs[2]" @click="setcurrentForcusImgId(2)" alt="">
          </button>
          <button class="thumb" :class="{ 'is-active': currentForucusImgId === 3 }" :data-src="currentPhotoImgs[3]">
            <img :src="currentPhotoImgs[3]" @click="setcurrentForcusImgId(3)" alt="">
          </button>
        </div>
    </section>
    `
};

export default PhotoGallery;