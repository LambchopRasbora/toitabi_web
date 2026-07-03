
const SpotReviewCard={
    props:{author: String,image: String,description:String,tags:Array},

    template:`<div class="spot-card">
        <img class ="spot-main-img" :src=image src="../../static/asset/images/default/NoImage.jpg"/>
        <div class= "content-card">
          <p class= "description">{{description}}</p>
          <p v-for="tag in tags" :key="tag.tagId" class="tag-text"> #{{tag.name}}</p>
        </div>
      </div>`
};

export default SpotReviewCard;