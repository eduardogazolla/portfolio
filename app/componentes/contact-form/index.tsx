"use client";

import { HiArrowNarrowRight } from "react-icons/hi";
import { Button } from "../button";
import { PageSection } from "../page-section";
import { SectionTitle } from "../section-title";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "motion/react";
import { fadeUpAnimation } from "@/app/lib/animations";
import { useLanguage } from "@/app/componentes/context/language-context";

const contactFormSchema = z.object({
  name: z.string().min(3).max(100),
  email: z.string().email(),
  message: z.string().min(1).max(500),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export const ContactForm = () => {
  const { translations } = useLanguage();

  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await axios.post("/api/contact", data);
      toast.success(translations.contact.successMessage);
      reset();
    } catch {
      toast.error(translations.contact.errorMessage);
    }
  };

  return (
    <PageSection
      id="contact"
      className="pt-28 md:pt-10 md:pb-40"
      innerClassName="flex flex-col gap-7 md:flex-row md:justify-between md:gap-12"
    >
      <SectionTitle
        title={translations.contactVoice.title}
        subtitle={translations.contactVoice.description}
        className="gap-7 md:gap-6"
        subtitleClassName="md:max-w-[440px] md:text-body-l"
      />
      <div className="w-full md:max-w-[480px] md:shrink-0">

        <motion.form
          className="w-full flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
          {...fadeUpAnimation}
        >
          <input
            placeholder={translations.contact.namePlaceholder}
            className="w-full h-14 bg-gray-800 rounded-lg placeholder:text-gray-400 text-gray-50 p-4 focus:outline-none focus:ring-2 ring-blue-600"
            {...register("name")}
          />
          <input
            placeholder={translations.contact.emailPlaceholder}
            type="email"
            className="w-full h-14 bg-gray-800 rounded-lg placeholder:text-gray-400 text-gray-50 p-4 focus:outline-none focus:ring-2 ring-blue-600"
            {...register("email")}
          />
          <textarea
            placeholder={translations.contact.messagePlaceholder}
            className="resize-none w-full h-[138px] bg-gray-800 rounded-lg placeholder:text-gray-400 text-gray-50 p-4 focus:outline-none focus:ring-2 ring-blue-600"
            maxLength={500}
            {...register("message")}
          />
          <div className="mx-auto mt-6">
            <Button type="submit" className="h-max" disabled={isSubmitting}>
              {translations.contact.sendButton}
              <HiArrowNarrowRight size={18} />
            </Button>
          </div>
        </motion.form>
      </div>
    </PageSection>
  );
};
