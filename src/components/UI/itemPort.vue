<template>
  <div class="itemsPort mb-5 ">
    <div class="blog-card">
      <div class="meta">
        <div
          class="photo"
          :style="{ backgroundImage: `url(${post.link})`}"
        />
        <ul class="details">
          <li class="author">
            <router-link
              v-if="post.get_username"
              :to="'/card/user/' + post.get_username"
            >
              {{ post.get_author }}
            </router-link>
            <a
              v-else
              href="#"
            >{{ post.get_author }}</a>
          </li>
          <li class="date">
            {{ post.get_date }}
          </li>
          <!-- <li class="tags">
            <ul>
              <li
                v-for="tag in post.skils"
                :key="tag.id"
              >
                {{ tag.name }}
              </li>
            </ul>
          </li> -->
          <li class="tags">
            <i
              class="fa fa-eye me-1"
              aria-hidden="true"
            />
            {{ post.count_viewers }}
          </li>
          <li class="tags">
            <i
              class="fa fa-comments me-1"
              aria-hidden="true"
            />
            {{ post.count_comments }}
          </li>
        </ul>
      </div>
      <div class="description">
        <h1>{{ post.title }}</h1>
        <p v-html="post.get_tranc_content" />
        <p class="read-more">
          <router-link :to="linkArticle(post.get_absolute_url)">
            Продолжить...
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ItemPortf',
  props: {
    post: {
      type: Object,
      default: undefined
    },
    prefix: {
      type: String,
      default: ''
    }
  },
  methods: {
    linkArticle (link) {
      return link.replace('/api/bag', '')
    }
  }
}
</script>

<style lang="scss">
$color_white: #fff;
$color_prime: #e67e22;
$color_grey: #e2e2e2;
$color_grey_dark: #a2a2a2;
.blog-card{
  display: flex;
  flex-direction: column;
    // margin-left: 25px;
    // margin-top: 52px;
   margin: 0 auto;
  box-shadow: 0 1px 2px 1px rgba(#000, .2);
  margin-bottom: 1.6%;
  background: $color_white;
  line-height: 1.4;
  font-family: sans-serif;
  border-radius: 5px;
  overflow: hidden;
  z-index: 0;
  a {
    color: inherit;
    &:hover {
      color: $color_prime;
    }
  }
  &:hover {
    .photo {
      transform: scale(1.3) rotate(3deg);
    }
  }
  .meta {
    position: relative;
    z-index: 0;
    height: 200px;
  }
  .photo {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-size: cover;
    background-position: center;
    transition: transform .2s;
  }
  .details,
  .details ul {
    margin: auto;
    padding: 0;
    list-style: none;
  }

  .details {
    position: absolute;
    top: 0;
    bottom: 0;
    // left: -100%;
    margin: auto;
    transition: left .2s;
    background: rgba(#000, .5);
    color: $color_white;
    padding: 10px;
    width: 100%;
    font-size: .9rem;
    a {
      text-decoration: dotted underline
    }
    ul li {
      display: inline-block;
    }
    .author:before {
      font-family: FontAwesome;
      margin-right: 10px;
      content: "\f007";
    }

    .date:before {
      font-family: FontAwesome;
      margin-right: 10px;
      content: "\f133";
    }

    .tags {
      ul:before {
        font-family: FontAwesome;
        content: "\f02b";
        margin-right: 10px;
      }
      li {
        margin-right: 2px;
        &:first-child {
          margin-left: -4px;
        }
      }
    }
  }
  .description {
    padding: 1rem;
    background: $color_white;
    position: relative;
    z-index: 1;
    h1,
    h2 {
      font-family: Poppins, sans-serif;
    }
    h1 {
      line-height: 1;
      margin: 0;
      font-size: 1.7rem;
    }
    h2 {
      font-size: 1rem;
      font-weight: 300;
      text-transform: uppercase;
      color: $color_grey_dark;
      margin-top: 5px;
    }
    .read-more {
      text-align: right;
      a {
        color: $color_prime;
        display: inline-block;
        position: relative;
        &:after {
          content: "\f061";
          font-family: FontAwesome;
          margin-left: -10px;
          opacity: 0;
          vertical-align: middle;
          transition: margin .3s, opacity .3s;
        }

        &:hover:after {
          margin-left: 5px;
          opacity: 1;
        }
      }
    }
  }
  p {
    position: relative;
    margin: 1rem 0 0;
    &:first-of-type {
      margin-top: 1.25rem;
      &:before {
        content: "";
        position: absolute;
        height: 5px;
        background: $color_prime;
        width: 35px;
        top: -0.75rem;
        border-radius: 3px;
      }
    }
  }
  &:hover {
    .details {
      left: 0%;
    }
  }
  @media (min-width: 640px) {
    flex-direction: row;
    max-width: 700px;
    .meta {
      flex-basis: 40%;
      height: auto;
    }
    .description {
      flex-basis: 60%;
      &:before {
        transform: skewX(-3deg);
        content: "";
        background: #fff;
        width: 30px;
        position: absolute;
        left: -10px;
        top: 0;
        bottom: 0;
        z-index: -1;
      }
    }
    &.alt {
      flex-direction: row-reverse;
      .description {
        &:before {
          left: inherit;
          right: -10px;
          transform: skew(3deg)
        }
      }
      .details {
        padding-left: 25px;
      }
    }
  }
}
</style>
