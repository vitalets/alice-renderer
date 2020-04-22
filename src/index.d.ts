export interface Button {
  title: string;
  url?: string;
  payload?: string;
  hide?: boolean;
}

export interface Response {
  text: string;
  tts?: string;
  card?: {
    type: "BigImage";
    image_id?: string;
    title?: string;
    descriptions?: string;
  };
  buttons?: Button[];
  end_session: boolean;
}

declare function reply(stringParts: string[]): Response;
declare function buttons(
  items: Array<string | Button>,
  defaults?: Button
): Button[];
declare function audio(name: string): void;
declare function effect(name: string): void;
declare function pause(ms?: number): void;
declare function br(count?: number): void;
declare function text(value: string | string[]): void;
declare function tts(value: string | string[]): void;
declare function textTts(
  textValue: string | string[],
  ttsValue: string | string[]
): void;
declare function plural(
  number: number,
  one: string,
  two: string,
  five: string
): void;
declare function enumerate(list: any[]): void;

declare function userify(userId: string, target: typeof reply): typeof reply;
declare function userify(
  userId: string,
  target: { [key: string]: typeof reply }
): { [key: string]: typeof reply };

declare function select(array: string[]): string;

declare function once(
  options: {
    calls?: number;
    seconds?: number;
    leading: boolean;
  },
  response: any
): void;

declare function configure(options: { disableRandom?: boolean });

declare function image(
  imageId: string,
  options?: {
    title?: string;
    description?: string;
    appendDescription?: string;
    button?: Button;
  }
): {
  type: "BigImage";
  image_id: string;
  title?: string;
  description?: string;
};
