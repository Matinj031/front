<template>
  <div id="test-details">
    <!--  Start: detail  -->
    <section>
      <v-container class="py-0">
        <div class="detail mt-md-4">
          <v-row>
            <v-col cols="12" md="12" class="pt-lg-0">
              <div class="label-holder" v-show="this.$route.name == 'test-id'">
                <v-chip
                  v-if="contentData.topic"
                  :to="`/search?type=azmoon&section=${contentData.section}&base=${contentData.base}&lesson=${contentData.lesson}&topic=${contentData.topic}`"
                  class="ma-1 blue-grey darken-1 white--text"
                  small
                >
                  {{ contentData.topic_title }}
                </v-chip>
                <v-chip
                  :to="`/search?type=azmoon&section=${contentData.section}&base=${contentData.base}&lesson=${contentData.lesson}`"
                  class="ma-1 blue-grey darken-1 white--text"
                  small
                >
                  {{ contentData.lesson_title }}
                </v-chip>
                <v-chip
                  :to="`/search?type=azmoon&section=${contentData.section}&base=${contentData.base}`"
                  link
                  class="mr-1 blue-grey darken-1 white--text"
                  small
                >
                  {{ contentData.base_title }}
                </v-chip>
                <v-chip
                  :to="`/search?type=azmoon&section=${contentData.section}`"
                  link
                  class="mr-1 blue-grey darken-1 white--text"
                  small
                >
                  {{ contentData.section_title }}
                </v-chip>
                <v-chip
                  v-if="contentData.tutorial_id"
                  :to="`/tutorial/${contentData.tutorial_id}`"
                  link
                  outlined
                  class="mr-1 blue-grey darken-1"
                  small
                >
                  Tutorial
                </v-chip>
              </div>
              <!--  Description   -->
              <div class="d-flex mb-4">
                <div class="w-100">
                  <div class="description-holder my-4">
                    <v-col class="test-list pt-0" cols="12">
                      <div
                        id="test-question"
                        class="text-h4"
                        ref="test-question"
                        v-html="contentData.question"
                      />
                      <img
                        v-show="contentData.q_file && contentData.q_file != '0'"
                        class="answer-img"
                        :src="contentData.q_file"
                      />

                      <v-radio-group
                        v-model="selectedOption"
                        @change="fireSelectedOption"
                        hide-details
                        v-if="
                          contentData.type == 'fourchoice' ||
                          contentData.type == 'twochoice' ||
                          contentData.type == 'tf'
                        "
                      >
                        <v-radio
                          value="1"
                          class="answer"
                          :class="{
                            'true-answer': isCorrectAnswer(1),
                            'false-answer': isIncorrectAnswer(1),
                          }"
                        >
                          <template slot="label">
                            <div class="answer">
                              <p>
                                <v-icon
                                  v-show="isCorrectAnswer(1)"
                                  color="success"
                                  class="mr-2"
                                  >mdi-check-circle</v-icon
                                >
                                <v-btn
                                  icon
                                  v-show="!isCorrectAnswer(1)"
                                  class="option-icon subtitle-1 mr-2"
                                  small
                                  >A</v-btn
                                >
                                <span
                                  ref="mathJaxEl"
                                  v-html="contentData.answer_a"
                                ></span>
                              </p>
                              <img
                                v-show="contentData.a_file"
                                class="answer-img"
                                :src="contentData.a_file"
                              />
                            </div>
                          </template>
                        </v-radio>
                        <v-radio
                          value="2"
                          class="answer"
                          :class="{
                            'true-answer': isCorrectAnswer(2),
                            'false-answer': isIncorrectAnswer(2),
                          }"
                        >
                          <template slot="label">
                            <div class="answer">
                              <v-icon
                                v-show="isCorrectAnswer(2)"
                                color="success"
                                class="mr-2"
                                >mdi-check-circle</v-icon
                              >
                              <v-btn
                                v-show="!isCorrectAnswer(2)"
                                icon
                                class="option-icon subtitle-1 mr-2"
                                small
                                >B</v-btn
                              >
                              <span
                                ref="mathJaxEl"
                                v-html="contentData.answer_b"
                              ></span>
                              <img
                                v-show="contentData.b_file"
                                :src="contentData.b_file"
                                class="answer-img"
                              />
                            </div>
                          </template>
                        </v-radio>
                        <v-radio
                          value="3"
                          v-if="contentData.type == 'fourchoice'"
                          class="answer"
                          :class="{
                            'true-answer': isCorrectAnswer(3),
                            'false-answer': isIncorrectAnswer(3),
                          }"
                        >
                          <template slot="label">
                            <div class="answer">
                              <v-icon
                                v-show="isCorrectAnswer(3)"
                                color="success"
                                class="mr-2"
                                >mdi-check-circle</v-icon
                              >
                              <v-btn
                                icon
                                v-show="!isCorrectAnswer(4)"
                                class="option-icon subtitle-1 mr-2"
                                small
                                >C</v-btn
                              >
                              <span
                                ref="mathJaxEl"
                                v-html="contentData.answer_c"
                              ></span>
                              <img
                                v-show="contentData.c_file"
                                class="answer-img"
                                :src="contentData.c_file"
                              />
                            </div>
                          </template>
                        </v-radio>
                        <v-radio
                          value="4"
                          v-if="contentData.type == 'fourchoice'"
                          class="answer"
                          :class="{
                            'true-answer': isCorrectAnswer(4),
                            'false-answer': isIncorrectAnswer(4),
                          }"
                        >
                          <template slot="label">
                            <div class="answer">
                              <v-icon
                                v-show="isCorrectAnswer(4)"
                                color="success"
                                class="mr-2"
                                >mdi-check-circle</v-icon
                              >
                              <v-btn
                                icon
                                v-show="!isCorrectAnswer(4)"
                                class="option-icon subtitle-1 mr-2"
                                small
                                >D</v-btn
                              >
                              <span
                                ref="mathJaxEl"
                                v-html="contentData.answer_d"
                              />

                              <img
                                v-show="contentData.d_file"
                                class="answer-img"
                                :src="contentData.d_file"
                              />
                            </div>
                          </template>
                        </v-radio>
                      </v-radio-group>

                      <!--Answer section-->
                      <!-- <v-expansion-panels
                        v-if="
                          contentData.answer_full ||
                          contentData.answer_full_file
                        "
                        class="mt-4"
                        v-model="fullAnswer"
                      >
                        <v-expansion-panel class="light-green">
                          <v-expansion-panel-header
                            @click="showAnswer()"
                            class="text-h5 font-weight-bold"
                            >Show answer
                          </v-expansion-panel-header>
                          <v-expansion-panel-content class="light-green">
                            <div
                              v-html="contentData.answer_full"
                              ref="mathJaxEl"
                            />
                            <br />
                            <img
                              v-show="contentData.answer_full_file"
                              class="answer-img"
                              :src="contentData.answer_full_file"
                            />
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels> -->
                      <!--End answer section-->

                      <!-- <v-row class="mt-3">
                        <v-col cols="10">
                          <v-btn icon @click="openCrashReportDialog">
                            <v-icon color="blue"> mdi-bullhorn-outline </v-icon>
                          </v-btn>
                        </v-col>
                      </v-row> -->
                    </v-col>
                  </div>

                  <!--Helpful link-->
                  <div class="justify-center text-center">
                    <v-btn
                      @click="loadNextTest()"
                      :loading="nextTestLoading"
                      class="next-test mx-auto text-transform-none"
                    >
                      {{
                        this.$route.name == "test-id"
                          ? "Try the Next One"
                          : "Time to Test!"
                      }}
                      <v-icon>mdi-skip-next-outline</v-icon>
                    </v-btn>
                  </div>

                  <!-- @click="loadNext(/test/${Number($route.params.id) + 1})" -->
                  <!--End helpful link-->
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </section>

    <!--  End: detail  -->

    <crash-report ref="crash_report" :report_type_list="report_type_list" />
  </div>
</template>
<script>
import CrashReport from "~/components/common/crash-report.vue";

export default {
  name: "test-details",
  props: {
    contentData: {
      type: Object,
      default: {},
    },
  },
  components: {
    CrashReport,
  },

  mounted() {
    document.title = this.$refs["test-question"].innerText;
    setTimeout(() => {
      this.renderMathJax();
    }, 2000);
  },

  data: () => ({
    sell_btn: true,
    rating: 4.5,
    breads: [
      {
        text: "Online exam",
        disabled: false,
        href: "/search?type=azmoon",
      },
    ],
    detail: {
      poster: "poster1.jpg",
      linkPoster: "",
      title:
        "A collection of 120 test questions for lessons 6 to 9 on (3) 12th",
      rate: 5,
      previewImage: "test1.png",
      labels: [
        "History (3)",
        "Twelfth",
        "Second Secondary",
        "Literature",
        "Kermanshah",
        "District 2",
        "Shohadai Parvin",
        "Farvardin",
        "2019",
      ],
    },
    model: null,
    fullAnswer: "",

    copy_btn: "Copy",
    download_loading: false,
    selectedOption: "",
    report_type_list: [
      {
        value: 1,
        label: "The selected option in the answer sheet is not correct.",
      },
      {
        value: 2,
        label: "There is more than one correct option.",
      },
      {
        value: 3,
        label: "None of the options are correct.",
      },
      {
        value: 4,
        label: "There are typos in questions or options.",
      },
      {
        value: 5,
        label: "This test is similar to another test in the same test.",
      },
      {
        value: 6,
        label: "There are problems in the descriptive answer.",
      },
      {
        value: 7,
        label: "This test is out of budget or topic.",
      },
      {
        value: 8,
        label: "Other cases",
      },
    ],
    nextTestLoading: false,
  }),

  watch: {},
  methods: {
    isCorrectAnswer(option) {
      // Check if the selected option is the correct answer
      return this.selectedOption && option == this.contentData.true_answer;
    },
    isIncorrectAnswer(option) {
      // Check if the selected option is incorrect
      return (
        this.selectedOption &&
        option == this.selectedOption &&
        option != this.contentData.true_answer
      );
    },
    openCrashReportDialog() {
      this.$refs.crash_report.dialog = true;
      this.$refs.crash_report.form.id = this.$route.params.id;
      this.$refs.crash_report.form.type = "examTest";
    },
    renderMathJax() {
      this.$renderMathJax(this.$refs.mathJaxEl);
    },
    showAnswer() {
      this.selectedOption = this.contentData.true_answer;

      setTimeout(() => {
        this.renderMathJax();
      }, 100);
    },
    fireSelectedOption() {
      this.fullAnswer = 0;
    },
    loadNextTest() {
      this.nextTestLoading = true;
      this.$axios
        .$get(
          `/api/v1/examTests/random?lesson=${this.contentData.lesson}&topic=${this.contentData.topic}`
        )
        .then((response) => {
          if (response.data.code)
            this.$router.push(`/test/${response.data.code}`);
        })
        .catch((err) => {
          // console.log(err);
          this.nextTestLoading = false;
        });
    },
  },
};
</script>

<style>
#test-details {
  .v-input--selection-controls__input {
    display: none;
  }

  .option-icon {
    border: 1px solid #e0e0e0;
  }

  .next-test.v-btn {
    height: 3.6rem;
    padding: 0rem 1.6rem;
    border-radius: 3rem;
    background: #ffb600;

    .v-btn__content {
      color: #24292f;
      font-size: 1.4rem;
      font-style: normal;
      font-weight: 600;
    }
  }
}

.content_main_info {
  padding: 27px;
  background: #f5f5f5 !important;
  border-radius: 6px;
}

.content_main_info .creator_title {
  font-size: 18px;
}

.order-btn-holder {
  /*position: -webkit-sticky!important;*/
  position: fixed !important;
  bottom: 0 !important;
  right: 0 !important;
  left: 0 !important;
  z-index: 2 !important;
  border-top: 0.1rem solid #e1e2e3;
}

.order-btn-holder .v-btn {
  width: 40% !important;
}

.order-btn-holder span {
  font-size: 1.3rem;
}

p {
  font-size: 1.3rem !important;
}

.answer {
  padding: 0.3rem 0.2rem 0.2rem 0.2rem;
}

.true-answer {
  border: 1px solid #4caf50; /* Green background color */
  color: white !important; /* White text color */
  border-radius: 10px;
}

.false-answer {
  border: 1px solid #f44336; /* Red background color */
  color: white !important; /* White text color */
  border-radius: 10px;
}

.answer {
  align-items: center;
  display: flex;
  height: auto;
  outline: none;
}

.answer-img {
  max-height: 15rem;
}
</style>
