
const SpotDescriptionCard={
    props:{author: String,description:String,tags:Array},

    template:` <section id ="discription-section" class="hint-section c-card">
        
        <div>
          <p class="description">{{description}} </p>
        </div>
        <div>
          <h4>投稿者</h4>
          <p id="author">{{author}} </p> 
        </div>
        <div>
          <h4>タグ</h4>
          <p v-for="tag in tags" :key="tag.tagId" id="tags"> #{{tag.name}}</p>
        </div>
      </section>`
};

export default SpotDescriptionCard;