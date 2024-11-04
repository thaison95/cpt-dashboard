<script setup lang="ts">
import { ref } from 'vue'
import { Button } from './ui/button'

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
})
const postContentBreak = ref(props.post.content.split('\n'))
const missingSentencesCount = Math.floor(postContentBreak.value.length * 0.5)

const randomMissingSentenceFn = () => {
  const randomNumber = (toNumner: number) => {
    return Math.floor(Math.random() * toNumner)
  }
  const missingSentence: number[] = []
  while (missingSentence.length < missingSentencesCount) {
    const randomIndex = randomNumber(postContentBreak.value.length - 1)
    if (missingSentence.includes(randomIndex)) {
      continue
    }
    missingSentence.push(randomIndex)
  }
  return missingSentence
}
const randomMissingSentenceIdx = ref(randomMissingSentenceFn())
const sortedRandom = randomMissingSentenceIdx.value.slice(0).sort()
const selectedSentence = ref<number[]>([])

const resultMsg = ref('')

const getSelected = (index: number) => {
  const indexOfSelected = sortedRandom.indexOf(index)
  return postContentBreak.value[selectedSentence.value[indexOfSelected]]
    ? postContentBreak.value[selectedSentence.value[indexOfSelected]]
    : '________'
}

const checkFn = () => {
  if (selectedSentence.value.length === missingSentencesCount) {
    const isCorrect = sortedRandom.every((value, index) => {
      return value === selectedSentence.value[index]
    })
    if (isCorrect) {
      resultMsg.value = 'Chính xác'
    } else {
      resultMsg.value = 'Không chính xác'
    }
  } else {
    resultMsg.value = 'Chưa hoàn thành'
  }
}
</script>

<template>
  <div class="clonee-post">
    <pre class="whitespace-pre-line leading-4">
      <span v-for="(sentence, index) in postContentBreak" :key="index" :class="randomMissingSentenceIdx.includes(index) ? 'text-purple-400': ''">
        {{ randomMissingSentenceIdx.includes(index) ? getSelected(index) : sentence }}
      </span>
    </pre>
    <div
      v-for="(missedSentenceIdx, index) in randomMissingSentenceIdx"
      :key="index"
      :class="`rounded border my-2 p-2 ${selectedSentence.includes(missedSentenceIdx) ? 'bg-gray-100' : ''}`"
      @click="
        !selectedSentence.includes(missedSentenceIdx)
          ? selectedSentence.push(missedSentenceIdx)
          : () => {}
      "
    >
      {{ postContentBreak[missedSentenceIdx] }}
    </div>
  </div>
  <div
    class="my-4"
    :class="resultMsg === 'Chính xác' ? 'text-green-500' : 'text-yellow-300'"
  >
    {{ resultMsg }}
  </div>
  <div>
    <Button @click="checkFn">Kiểm tra</Button>
    <Button
      class="ml-2"
      variant="outline"
      @click="(selectedSentence = []), (resultMsg = '')"
      >Làm lại</Button
    >
  </div>
</template>
