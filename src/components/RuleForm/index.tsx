import { useRouter } from "next/router";
import prettyMilliseconds from "pretty-ms";
import Slider from "rc-slider";
import {
  useForm,
  Controller,
  SubmitHandler,
  useFieldArray,
} from "react-hook-form";
import styles from "./style.module.scss";

type Handicap = {
  time: string;
};

export type FieldValues = {
  first: string;
  handicaps: Handicap[];
  player: number;
  time: number;
};

export type RuleFormProps = {
  defaultValues: FieldValues;
  disabledPlayer?: boolean;
  onSubmit: SubmitHandler<FieldValues>;
};

function RuleForm({
  defaultValues,
  disabledPlayer,
  onSubmit,
}: RuleFormProps): JSX.Element {
  const { control, handleSubmit, register, setValue, watch } =
    useForm<FieldValues>({
      defaultValues,
    });
  const { append, fields, remove } = useFieldArray({
    control,
    name: "handicaps",
  });
  const router = useRouter();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.inner}>
        <div className={styles.fieldsetsWrapper}>
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>{`プレイ人数：${watch(
              "player"
            )}人`}</legend>
            <Controller
              control={control}
              name="player"
              render={({ field }): JSX.Element => (
                <Slider
                  {...field}
                  disabled={disabledPlayer}
                  max={6}
                  min={2}
                  onAfterChange={(player): void => {
                    if (typeof player !== "number") {
                      return;
                    }

                    const difference = player - watch("handicaps").length;

                    if (difference < 0) {
                      setValue("first", "");
                    }

                    const callback =
                      difference > 0
                        ? (): void => append({ time: "0" })
                        : (): void => remove(watch("handicaps").length - 1);

                    Array(Math.abs(difference))
                      .fill(undefined)
                      .forEach(callback);
                  }}
                />
              )}
            />
          </fieldset>
          <fieldset className={styles.fieldset}>
            <legend className={styles.timeLegend}>
              持ち時間：
              <span className={styles.time}>
                {prettyMilliseconds(watch("time") * 1000, {
                  verbose: true,
                })
                  .replaceAll(" ", "")
                  .replace("minutes", "分")
                  .replace("minute", "分")
                  .replace("seconds", "秒")}
              </span>
            </legend>
            <Controller
              control={control}
              name="time"
              render={({ field }): JSX.Element => (
                <Slider {...field} max={60 * 10} min={30} step={30} />
              )}
            />
          </fieldset>
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>ハンデ</legend>
            <div className={styles.selectsWrapper}>
              {fields.map(({ id }, index) => (
                <label key={id}>
                  <span>{`${index + 1}P：`}</span>
                  <select
                    {...register(`handicaps.${index}.time`)}
                    className={styles.select}
                  >
                    <option value="0">なし</option>
                    <option value="30">30秒</option>
                    <option value="60">1分</option>
                    <option value="90">1分30秒</option>
                    <option value="120">2分</option>
                    <option value="150">2分30秒</option>
                    <option value="180">3分</option>
                  </select>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>順番</legend>
            <div className={styles.selectsWrapper}>
              <label>
                <span>最初のプレイヤー：</span>
                <select {...register("first")} className={styles.select}>
                  <option value="">ランダム</option>
                  {Array(watch("player"))
                    .fill(undefined)
                    .map((_, index) => (
                      <option key={index} value={index}>{`${
                        index + 1
                      }P`}</option>
                    ))}
                </select>
              </label>
            </div>
          </fieldset>
        </div>
        <div className={styles.buttonsWrapper}>
          <button
            className={styles.button}
            onClick={(): void => {
              router.push("/");
            }}
            type="button"
          >
            戻る
          </button>
          <button className={styles.submitButton} type="submit">
            レッツパーティ！
          </button>
        </div>
      </div>
    </form>
  );
}

export default RuleForm;
